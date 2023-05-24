export function validatePassWord() {
  return {
    validator(_, value) {
      if (
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,\]/[{}])[A-Za-z\d@$!%*?&.,\]/[{}]{4,}$/.test(
          value,
        )
      ) {
        return Promise.resolve();
      }
      return Promise.reject(
        new Error(
          'Mật khẩu phải chứa ít nhất 1 ký tự viết hoa, \n 1 ký tự viết thường, 1 ký tự đặc biệt và 1 số',
        ),
      );
    },
  };
}
