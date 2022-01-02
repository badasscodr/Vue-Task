import iziToast from "izitoast"

const globalMethods = {
	notificationMessage: (message) => {
        iziToast.success({
            class: 'categories-toast',
            title: 'Success',
            message: `${message}`,
            displayMode: 1,
            position: 'topRight',
            timeout: 3000,
        });
    },
    notificationError: (error) => {
        iziToast.error({
            class: 'categories-toast',
            title: 'Error',
            message: error,
            displayMode: 1,
            position: 'topRight',
            timeout: 3000,
        });
    },
    notificationErrorCustom: (error) => {
        iziToast.info({
            class: 'product-toast',
            // title: 'Error',
            message: error,
            displayMode: 1,
            position: 'bottomCenter',
            timeout: 3000,
        });
    }
}

export default globalMethods