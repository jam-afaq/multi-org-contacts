import Swal from 'sweetalert2';

export const confirmAction = async (
    title: string = 'Are you sure?',
    text: string = 'This action cannot be undone!',
    confirmButtonText: string = 'Yes, proceed!',
    cancelButtonText: string = 'Cancel',
    icon: 'warning' | 'error' | 'success' | 'info' | 'question' = 'warning'
): Promise<boolean> => {
    const result = await Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText,
        cancelButtonText,
    });

    return result.isConfirmed;
};

export const showSuccess = (title: string, text: string = '') => {
    Swal.fire({
        title,
        text,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
    });
};

export const showError = (title: string, text: string = '') => {
    Swal.fire({
        title,
        text,
        icon: 'error',
        confirmButtonText: 'OK',
    });
};
