export const URL_SUBMIT = import.meta.env.VITE_BE_URL + "/submit";

export const fileToBase64 = (file: File) => {
  return new Promise<string>((res, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
      res(reader.result as string);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
      reject(error);
    };
  });
};
