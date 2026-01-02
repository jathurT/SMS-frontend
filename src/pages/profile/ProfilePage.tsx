import { useAuth } from "@/contexts/authContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Shield,
  Calendar,
  CheckCircle2,
  Key,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ProfilePage = () => {
  const { user, token, hasRole } = useAuth();

  // Get user initials for avatar
  const getInitials = () => {
    if (!user) return "U";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  // Parse token to get additional info
  const getTokenInfo = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        issuedAt: new Date(payload.iat * 1000),
        expiresAt: new Date(payload.exp * 1000),
        roles: payload.realm_access?.roles || [],
        subject: payload.sub,
        preferredUsername: payload.preferred_username,
      };
    } catch (e) {
      return null;
    }
  };

  const tokenInfo = getTokenInfo();

  // Determine user role badge
  const getUserRole = () => {
    if (hasRole("ADMIN")) return { label: "ADMIN", variant: "destructive" as const };
    if (hasRole("LECTURER")) return { label: "LECTURER", variant: "default" as const };
    if (hasRole("STUDENT")) return { label: "STUDENT", variant: "secondary" as const };
    return { label: "USER", variant: "outline" as const };
  };

  const userRole = getUserRole();

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6 bg-background">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account information and preferences
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">
              {user?.firstName} {user?.lastName}
            </CardTitle>
            <CardDescription>
              <div className="flex justify-center gap-2 mt-2">
                <Badge variant={userRole.variant}>{userRole.label}</Badge>
                {user?.emailVerified && (
                  <Badge variant="outline" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground break-all">
                  {user?.email || "No email"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {user?.username || tokenInfo?.preferredUsername || "No username"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>
              Your account details and authentication information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <p className="text-muted-foreground">
                    {user?.firstName || "Not set"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <p className="text-muted-foreground">
                    {user?.lastName || "Not set"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-muted-foreground break-all">
                    {user?.email || "Not set"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <p className="text-muted-foreground">
                    {user?.username || tokenInfo?.preferredUsername || "Not set"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Roles & Permissions */}
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">
                Roles & Permissions
              </h3>
              <div className="flex flex-wrap gap-2">
                {tokenInfo?.roles && tokenInfo.roles.length > 0 ? (
                  tokenInfo.roles.map((role: string) => (
                    <Badge key={role} variant="secondary">
                      {role}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No roles assigned</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Session Information */}
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground flex items-center gap-2">
                <Key className="h-4 w-4" />
                Session Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Session Started:</span>
                  <span className="text-muted-foreground">
                    {tokenInfo?.issuedAt
                      ? tokenInfo.issuedAt.toLocaleString()
                      : "Unknown"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Session Expires:</span>
                  <span className="text-muted-foreground">
                    {tokenInfo?.expiresAt
                      ? tokenInfo.expiresAt.toLocaleString()
                      : "Unknown"}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">User ID:</span>
                  <p className="text-muted-foreground text-xs break-all mt-1 font-mono">
                    {tokenInfo?.subject || "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Security</CardTitle>
            <CardDescription>Your account security status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Email Verified</span>
                <Badge variant={user?.emailVerified ? "default" : "secondary"}>
                  {user?.emailVerified ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Two-Factor Auth</span>
                <Badge variant="secondary">Not Configured</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Type</CardTitle>
            <CardDescription>Your current role and access level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Primary Role</span>
                <Badge variant={userRole.variant}>{userRole.label}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Access Level</span>
                <Badge variant="outline">
                  {hasRole("ADMIN") ? "Full Access" : "Limited Access"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity</CardTitle>
            <CardDescription>Your recent account activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Last Login</span>
                <span className="text-xs text-muted-foreground">
                  {tokenInfo?.issuedAt
                    ? new Date(tokenInfo.issuedAt).toLocaleDateString()
                    : "Unknown"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Status</span>
                <Badge variant="default" className="bg-green-500">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
