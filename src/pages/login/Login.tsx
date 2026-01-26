import LoginForm from '../../features/auth/LoginForm';
import ErrorBoundary from '../../components/shared/ErrorBoundary';

const Login = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
            <ErrorBoundary>
                <LoginForm />
            </ErrorBoundary>
        </div>
    );
};

export default Login;
