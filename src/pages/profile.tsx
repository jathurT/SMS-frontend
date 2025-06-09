import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Clock,
  RefreshCw,
  Key,
  UserCircle,
  Settings,
  LogOut
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, token, getUserRoles, refreshToken, logout } = useAuth();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  // Get user roles
  const userRoles = getUserRoles();

  // Parse token information
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setTokenInfo({
          subject: payload.sub,
          issuer: payload.iss,
          audience: payload.aud,
          issuedAt: new Date(payload.iat * 1000),
          expiresAt: new Date(payload.exp * 1000),
          notBefore: payload.nbf ? new Date(payload.nbf * 1000) : null,
          sessionState: payload.session_state,
          preferredUsername: payload.preferred_username,
          scope: payload.scope,
        });
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, [token]);

  // Handle token refresh
  const handleRefreshToken = async () => {
    setIsRefreshing(true);
    try {
      const success = await refreshToken();
      if (success) {
        toast({
          title: "Token Refreshed",
          description: "Your authentication token has been refreshed successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh authentication token.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "An error occurred during logout.",
        variant: "destructive",
      });
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Get role badge color
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'DEPARTMENT_ADMIN':
        return 'default';
      case 'LECTURER':
        return 'secondary';
      case 'STUDENT':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefreshToken}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Token
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar and Name */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.attributes?.picture?.[0]} />
                <AvatarFallback className="text-lg">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.username || 'Unknown User'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  @{user?.username || 'username'}
                </p>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.email || 'Not provided'}
                  </p>
                </div>
              </div>

              {user?.attributes?.phone && (
                <div className="flex items-center space-x-3">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {user.attributes.phone[0]}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Roles and Permissions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Roles & Permissions
            </CardTitle>
            <CardDescription>
              Your assigned roles and access levels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Assigned Roles</p>
              <div className="flex flex-wrap gap-2">
                {userRoles.length > 0 ? (
                  userRoles.map((role) => (
                    <Badge
                      key={role}
                      variant={getRoleBadgeVariant(role)}
                      className="text-xs"
                    >
                      {role}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline" className="text-xs">
                    No roles assigned
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium mb-2">Access Level</p>
              <p className="text-sm text-muted-foreground">
                {userRoles.includes('ADMIN')
                  ? 'Full system access with administrative privileges'
                  : userRoles.includes('LECTURER')
                  ? 'Educational content management and student oversight'
                  : userRoles.includes('STUDENT')
                  ? 'Access to courses, enrollment, and attendance'
                  : 'Limited access - please contact administrator'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Account Details
            </CardTitle>
            <CardDescription>
              Technical information about your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">User ID</p>
                <p className="text-muted-foreground font-mono text-xs">
                  {tokenInfo?.subject || 'Not available'}
                </p>
              </div>
              <div>
                <p className="font-medium">Username</p>
                <p className="text-muted-foreground">
                  {tokenInfo?.preferredUsername || user?.username || 'Not available'}
                </p>
              </div>
              <div>
                <p className="font-medium">Session</p>
                <p className="text-muted-foreground font-mono text-xs">
                  {tokenInfo?.sessionState?.substring(0, 8) || 'Not available'}...
                </p>
              </div>
              <div>
                <p className="font-medium">Scope</p>
                <p className="text-muted-foreground text-xs">
                  {tokenInfo?.scope || 'Not available'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Session Information
            </CardTitle>
            <CardDescription>
              Current authentication session details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tokenInfo && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Issued At</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {tokenInfo.issuedAt.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Expires At</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {tokenInfo.expiresAt.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Time Remaining</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.max(0, Math.floor((tokenInfo.expiresAt.getTime() - Date.now()) / 1000 / 60))} minutes
                  </span>
                </div>
              </div>
            )}

            <Separator />

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Issuer</span>
              <span className="text-sm text-muted-foreground">
                Keycloak Authentication
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>
            Manage your account and session
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            onClick={handleRefreshToken}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Session
          </Button>
          
          <Button
            variant="destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>

      {/* Debug Information (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
            <CardDescription>
              Development only - token and user data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <details className="cursor-pointer">
              <summary className="text-sm font-medium mb-2">Raw User Data</summary>
              <pre className="text-xs bg-muted p-4 rounded-md overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </details>
            <details className="cursor-pointer mt-4">
              <summary className="text-sm font-medium mb-2">Token Payload</summary>
              <pre className="text-xs bg-muted p-4 rounded-md overflow-auto">
                {JSON.stringify(tokenInfo, null, 2)}
              </pre>
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;