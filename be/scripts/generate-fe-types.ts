import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

const BE_SRC = path.join(__dirname, '../src');
const FE_BASE = path.join(__dirname, '../../fe/binex/app');
const FE_TYPES_BASE = path.join(FE_BASE, 'types');
const FE_API_BASE = path.join(FE_BASE, 'api');

function generateAll() {
  console.log('🧹 Đang làm sạch và tái cấu trúc hệ thống Type an toàn...');

  const typeRegistry: Record<string, { module: string; category: string }> = {};
  const resultStructure: Record<string, Record<string, string>> = {
    payload: {},
    response: {},
    enums: {},
  };

  // CHỈ quét các file chứa dữ liệu (DTO, Entity, Response, Enum)
  const files = glob.sync('**/*.{dto,entity,response,enum}.ts', {
    cwd: BE_SRC,
  });

  files.forEach((file) => {
    const content = fs.readFileSync(path.join(BE_SRC, file), 'utf8');
    const moduleName = getModuleName(file);
    const regex =
      /export (class|interface|type|enum) (\w+)(?:\s+extends\s+PartialType\((\w+)\))?/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const kind = match[1];
      const typeName = match[2];
      const partialParent = match[3];

      // Bỏ qua các class hệ thống nếu lọt lưới
      if (
        typeName.endsWith('Service') ||
        typeName.endsWith('Controller') ||
        typeName.endsWith('Guard') ||
        typeName.endsWith('Strategy')
      )
        continue;

      let category = 'response';
      if (kind === 'enum' || file.endsWith('.enum.ts')) category = 'enums';
      else if (file.endsWith('.dto.ts')) category = 'payload';
      else if (file.endsWith('.entity.ts') || file.endsWith('.response.ts'))
        category = 'response';

      typeRegistry[typeName] = { module: moduleName, category };

      const startIndex = content.indexOf('{', match.index);
      if (startIndex !== -1) {
        const endIndex = getClosingBracketIndex(content, startIndex);
        if (endIndex !== -1) {
          let body = content.substring(startIndex + 1, endIndex);

          if (kind !== 'enum') {
            // 1. Nhận diện @IsOptional và đánh dấu các dòng cần thêm '?'
            const lines = body.split('\n');
            const processedLines: string[] = [];
            let isOptional = false;

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.includes('@IsOptional')) {
                isOptional = true;
                continue;
              }
              if (trimmed.startsWith('@')) continue; // Bỏ qua các decorator khác

              if (trimmed.includes(':')) {
                const parts = trimmed.split(':');
                let prop = parts[0].trim();
                const type = parts[1].trim();

                if (isOptional && !prop.includes('?')) {
                  prop = `${prop}?`;
                }
                processedLines.push(`  ${prop.trim()}: ${type.trim()}`);
                isOptional = false; // Reset sau khi áp dụng
              } else if (trimmed === '') {
                processedLines.push('');
              }
            }

            body = processedLines
              .filter((l) => l !== null && !l.includes('('))
              .join('\n');
          }

          if (!resultStructure[category][moduleName])
            resultStructure[category][moduleName] = '';
          resultStructure[category][moduleName] +=
            kind === 'enum'
              ? `export enum ${typeName} {\n${body}\n}\n\n`
              : `export interface ${typeName}${partialParent ? ` extends Partial<${partialParent}>` : ''} {\n${body}\n}\n\n`;
        }
      }
    }
  });

  // Ghi file Types
  ['payload', 'response', 'enums'].forEach((cat) => {
    const dir = path.join(FE_TYPES_BASE, cat);
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });

    Object.keys(resultStructure[cat]).forEach((mod) => {
      const content = resultStructure[cat][mod];
      const imports: Record<string, Set<string>> = {};

      Object.keys(typeRegistry).forEach((typeName) => {
        const info = typeRegistry[typeName];
        const isUsed = new RegExp(`\\b${typeName}\\b`).test(content);
        const isDefinedHere = new RegExp(
          `export (interface|enum) ${typeName}\\b`,
        ).test(content);

        if (isUsed && !isDefinedHere) {
          const importPath =
            info.category === cat
              ? `./${info.module}`
              : `../${info.category}/${info.module}`;
          if (!imports[importPath]) imports[importPath] = new Set();
          imports[importPath].add(typeName);
        }
      });

      const importLines = Object.keys(imports).map(
        (p) =>
          `import type { ${Array.from(imports[p]).join(', ')} } from '${p}';`,
      );
      const finalContent = `/** Auto-generated ${cat} */\n${importLines.join('\n')}\n\n${content}`;
      fs.writeFileSync(path.join(dir, `${mod}.ts`), finalContent);
    });
    fs.writeFileSync(
      path.join(dir, 'index.ts'),
      Object.keys(resultStructure[cat])
        .map((m) => `export * from './${m}';`)
        .join('\n'),
    );
  });

  // Sinh API Services (Quét Controller)
  if (fs.existsSync(FE_API_BASE))
    fs.rmSync(FE_API_BASE, { recursive: true, force: true });
  fs.mkdirSync(FE_API_BASE, { recursive: true });

  const controllers = glob.sync('**/*.controller.ts', { cwd: BE_SRC });
  controllers.forEach((file) => {
    const content = fs.readFileSync(path.join(BE_SRC, file), 'utf8');
    const moduleName = getModuleName(file);
    const endpoints = extractEndpoints(content);
    if (endpoints.length === 0) return;

    const typesToImport = new Set<string>();
    let methods = '';
    endpoints.forEach((ep) => {
      if (ep.payloadType && typeRegistry[ep.payloadType])
        typesToImport.add(ep.payloadType);
      if (ep.responseType && typeRegistry[ep.responseType])
        typesToImport.add(ep.responseType);

      let respType = ep.responseType || 'any';
      if (['String', 'Number', 'Boolean'].includes(respType))
        respType = respType.toLowerCase();
      let finalPath = ep.path;
      const payloadArg = ep.payloadType ? `payload: ${ep.payloadType}` : '';
      let callArgs = ep.payloadType ? `, payload` : '';

      // Nếu path có biến (ví dụ: /news/:id), chuyển sang template literal
      if (finalPath.includes(':')) {
        const pathVarMatch = finalPath.match(/:(\w+)/);
        if (pathVarMatch) {
          const varName = pathVarMatch[1];
          finalPath = finalPath.replace(`:${varName}`, `\${payload}`);
          // Nếu path có biến thì payload chính là biến đó (thường là string/id)
          callArgs = ''; // Không truyền payload vào params/body nữa vì nó nằm trong URL
        }
      }

      const pathQuote = finalPath.includes('${') ? '`' : "'";
      methods += `    ${ep.name}: (${payloadArg}) => \n      api.call<${respType}, ApiError>(${pathQuote}${finalPath}${pathQuote}, '${ep.method}'${callArgs}),\n\n`;
    });

    const importLines = Array.from(typesToImport).map((t) => {
      const info = typeRegistry[t];
      return `import type { ${t} } from '~/types/${info.category}/${info.module}';`;
    });

    const apiContent = `/** Auto-generated API */\nimport type { ApiError } from '~/types/api-error';\n${importLines.join('\n')}\n\nexport const use${capitalize(moduleName)}Api = () => {\n  const api = useApi();\n  return {\n${methods}  };\n};\n`;
    fs.writeFileSync(path.join(FE_API_BASE, `${moduleName}.ts`), apiContent);
  });

  fs.writeFileSync(
    path.join(FE_API_BASE, 'index.ts'),
    Object.keys(apiModulesFromFiles(controllers))
      .map((m) => `export * from './${m}';`)
      .join('\n'),
  );

  console.log('✅ Hệ thống đã được làm sạch và hoạt động ổn định!');
}

function getModuleName(file: string) {
  const parts = file.split(/[/\\]/);
  return parts[0] === 'modules' ? parts[1] : parts[0] || 'common';
}

function apiModulesFromFiles(files: string[]) {
  const mods: Record<string, boolean> = {};
  files.forEach((f) => (mods[getModuleName(f)] = true));
  return mods;
}

function getClosingBracketIndex(str: string, startIndex: number) {
  let count = 0;
  for (let i = startIndex; i < str.length; i++) {
    if (str[i] === '{') count++;
    else if (str[i] === '}') {
      count--;
      if (count === 0) return i;
    }
  }
  return -1;
}

function extractEndpoints(content: string) {
  const endpoints: any[] = [];
  const controllerMatch = /@Controller\(['"](.*?)['"]\)/.exec(content);
  if (!controllerMatch) return [];
  const base = controllerMatch[1];
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const decoratorMatch =
      /@(Post|Get|Patch|Delete|Put)\((?:['"](.*?)['"])?\)/.exec(line);
    if (decoratorMatch) {
      const method = decoratorMatch[1].toUpperCase();
      const subPath = decoratorMatch[2] || '';
      const fullPath = `/${base}${subPath ? '/' + subPath : ''}`.replace(
        /\/+/g,
        '/',
      );
      let methodName = '',
        payloadType = '',
        responseType = '';
      const nearbyLines = lines.slice(
        Math.max(0, i - 3),
        Math.min(lines.length, i + 6),
      );
      nearbyLines.forEach((nl) => {
        const respMatch = /@ApiResponse\({[\s\S]*?type:\s*(\w+)/.exec(nl);
        if (respMatch) responseType = respMatch[1];
      });
      for (let j = i + 1; j < i + 8 && j < lines.length; j++) {
        const nextLine = lines[j].trim();
        if (nextLine.startsWith('@')) {
          const respMatch = /@ApiResponse\({[\s\S]*?type:\s*(\w+)/.exec(
            nextLine,
          );
          if (respMatch) responseType = respMatch[1];
          continue;
        }
        const funcMatch = /(\w+)\s*\(/.exec(nextLine);
        if (funcMatch && !methodName) methodName = funcMatch[1];
        const bodyMatch = /@Body\(\)\s*(?:\w+:\s*)?(\w+)/.exec(nextLine);
        if (bodyMatch) payloadType = bodyMatch[1];
        const queryMatch = /@Query\(\)\s*(?:\w+:\s*)?(\w+)/.exec(nextLine);
        if (queryMatch) payloadType = queryMatch[1] || 'any';

        // Nhận diện @Param để tạo tham số cho URL (ví dụ: id)
        const paramMatch = /@Param\(['"](\w+)['"]\)\s*(\w+)/.exec(nextLine);
        if (paramMatch) {
          const paramName = paramMatch[2];
          payloadType = 'string'; // Mặc định là string cho ID
        }

        if (methodName) break;
      }
      if (methodName)
        endpoints.push({
          name: methodName,
          method,
          path: fullPath,
          payloadType,
          responseType,
        });
    }
  }
  return endpoints;
}

function capitalize(s: string) {
  return s
    .split(/[-_]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

generateAll();
