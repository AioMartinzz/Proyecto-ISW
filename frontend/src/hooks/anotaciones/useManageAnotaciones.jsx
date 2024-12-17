import { updateAnotacion, deleteAnotacion } from '@services/anotacion.service.js';

const useManageAnotaciones = (fetchAnotaciones) => {
    const handleUpdateAnotacion = async (id, data) => {
        try {
            await updateAnotacion(id, data); // Llama al servicio para actualizar
            fetchAnotaciones(); // Refresca la lista
        } catch (error) {
            console.error('Error actualizando la anotación:', error);
            throw error;
        }
    };

    const handleDeleteAnotacion = async (id) => {
        try {
            await deleteAnotacion(id); // Llama al servicio para eliminar
            fetchAnotaciones(); // Refresca la lista
        } catch (error) {
            console.error('Error eliminando la anotación:', error);
            throw error;
        }
    };

    return { handleUpdateAnotacion, handleDeleteAnotacion };
};

export default useManageAnotaciones;
