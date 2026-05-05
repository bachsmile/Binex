import { ref } from 'vue';

export const useEffects = () => {
  // Trạng thái bật/tắt hiệu ứng rê chuột toàn hệ thống, mặc định là true
  const showMouseFollower = useState('showMouseFollower', () => true);

  const enableMouseFollower = () => {
    showMouseFollower.value = true;
  };

  const disableMouseFollower = () => {
    showMouseFollower.value = false;
  };

  return {
    showMouseFollower,
    enableMouseFollower,
    disableMouseFollower
  };
};
