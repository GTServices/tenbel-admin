const convertToBase64 = async (event) => {
  // convert file to base64 encoded
  const file = event.files[0];
  const reader = new FileReader();
  let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url
  reader.readAsDataURL(blob);
  reader.onloadend = function () {
    const base64data = reader.result;
    return base64data;
  };
};

export default convertToBase64;
