import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToast = {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    info: (message: string) => toast.info(message),
    warning: (message: string) => toast.warning(message),
};

export const confirmAction = (
    title: string = 'Are you sure?',
    text: string = 'This action cannot be undone!',
    confirmButtonText: string = 'Yes, proceed!',
    cancelButtonText: string = 'Cancel'
): Promise<boolean> => {
    return new Promise((resolve) => {
        // We'll implement this with SweetAlert in the next step
        const result = window.confirm(`${title}\n\n${text}`);
        resolve(result);
    });
};
