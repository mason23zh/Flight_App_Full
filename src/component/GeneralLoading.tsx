import { CustomProvider, Loader } from "rsuite";

const GeneralLoading = ({ themeMode }) => {
    return (
        <CustomProvider theme={themeMode}>
            <div className="text-center">
                <Loader size="md" center content="loading..." />
            </div>
        </CustomProvider>
    );
};

export default GeneralLoading;