import React from 'react';
import { useAuth } from '../contexts/authContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { GraduationCap, Lock, ArrowRight } from 'lucide-react';
import Logo from '@/assets/images/Logo.svg';

const Login: React.FC = () => {
    const { login } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 dark:from-primary/10 dark:via-background dark:to-primary/5 p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Logo and Header */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                            <img
                                src={Logo}
                                className="h-24 w-24 relative"
                                alt="SM System Logo"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Welcome Back
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Student Management System
                        </p>
                    </div>
                </div>

                {/* Login Card */}
                <Card className="border-2 shadow-xl">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl flex items-center justify-center gap-2">
                            <Lock className="h-5 w-5 text-primary" />
                            Secure Login
                        </CardTitle>
                        <CardDescription className="text-center">
                            Sign in with your Keycloak account to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            onClick={login}
                            className="w-full h-12 text-lg font-semibold group"
                            size="lg"
                        >
                            Login with Keycloak
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>

                        {/* Features */}
                        <div className="pt-4 space-y-3">
                            <div className="flex items-start gap-3 text-sm text-muted-foreground">
                                <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-foreground">Centralized Management</p>
                                    <p className="text-xs">Access all student information in one place</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-muted-foreground">
                                <Lock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-foreground">Secure Authentication</p>
                                    <p className="text-xs">Protected by enterprise-grade security</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-sm text-muted-foreground">
                    Having trouble logging in? Contact your system administrator
                </p>
            </div>
        </div>
    );
};

export default Login;