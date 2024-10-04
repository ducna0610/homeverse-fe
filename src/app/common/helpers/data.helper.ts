const objectToFormData = (obj: Object) => {
    const formData = new FormData();

    Object.entries(obj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(item => {
                formData.append(key, item);
            })
        } else {
            formData.append(key, value);
        }
    });

    return formData;
};

export default { objectToFormData };
