import React from 'react';
import { useAuth } from '../contexts/authContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const Login: React.FC = () => {
    const { login } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Student Management System</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button onClick={login} className="w-full">
                        Login with Keycloak
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;