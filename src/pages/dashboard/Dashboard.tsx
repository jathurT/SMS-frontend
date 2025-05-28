import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    CalendarIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon as PendingIcon,
    Users2Icon,
    TrendingUpIcon,
    ActivityIcon,
} from "lucide-react";

const Dashboard: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState<string>("");

    useEffect(() => {
        // Set current month
        const now = new Date();
        const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
        setCurrentMonth(monthName);
    }, []);

    return (
        <div className="min-h-screen p-4 md:p-6 space-y-6 bg-background">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome to your dashboard overview
                    </p>
                </div>

                <div className="mt-2 md:mt-0">
                    <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary flex gap-2 py-1 px-3"
                    >
                        <CalendarIcon size={16} />
                        <span>Current Month: {currentMonth}</span>
                    </Badge>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="overflow-hidden border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                    Total Sales
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold">$12,426</p>
                                    <span className="text-sm text-muted-foreground">
                                        +12%
                                    </span>
                                </div>
                            </div>
                            <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                                <TrendingUpIcon className="h-5 w-5 text-green-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                    New Customers
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold">152</p>
                                    <span className="text-sm text-muted-foreground">
                                        +8%
                                    </span>
                                </div>
                            </div>
                            <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
                                <Users2Icon className="h-5 w-5 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-l-4 border-l-amber-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                    Pending Orders
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold">23</p>
                                    <span className="text-sm text-muted-foreground">
                                        -4%
                                    </span>
                                </div>
                            </div>
                            <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full">
                                <PendingIcon className="h-5 w-5 text-amber-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                    Active Projects
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold">8</p>
                                    <span className="text-sm text-muted-foreground">
                                        +2
                                    </span>
                                </div>
                            </div>
                            <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-full">
                                <ActivityIcon className="h-5 w-5 text-purple-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Welcome Card */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Welcome to Your Dashboard</CardTitle>
                    <CardDescription>
                        This is your main dashboard where you can view key metrics and manage your data.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="flex-1">
                            <p className="text-muted-foreground">
                                Get started by exploring the navigation menu or customize this dashboard 
                                to show the information that matters most to you.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="secondary">New</Badge>
                            <Badge variant="outline">Updated</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
                                <Users2Icon className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Manage Users</h3>
                                <p className="text-sm text-muted-foreground">
                                    Add, edit, or remove users
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
                                <CheckCircleIcon className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold">View Reports</h3>
                                <p className="text-sm text-muted-foreground">
                                    Generate and view reports
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
                                <ActivityIcon className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Analytics</h3>
                                <p className="text-sm text-muted-foreground">
                                    View detailed analytics
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                    <CardDescription>
                        Latest updates and changes in your system
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                            <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">New user registered</p>
                                <p className="text-sm text-muted-foreground">John Doe joined the platform</p>
                            </div>
                            <span className="text-sm text-muted-foreground">2 hours ago</span>
                        </div>

                        <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                            <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
                                <ActivityIcon className="h-4 w-4 text-blue-500" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">System update completed</p>
                                <p className="text-sm text-muted-foreground">Version 2.1.0 deployed successfully</p>
                            </div>
                            <span className="text-sm text-muted-foreground">1 day ago</span>
                        </div>

                        <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                            <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full">
                                <PendingIcon className="h-4 w-4 text-amber-500" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">Maintenance scheduled</p>
                                <p className="text-sm text-muted-foreground">Server maintenance on Sunday 2:00 AM</p>
                            </div>
                            <span className="text-sm text-muted-foreground">3 days ago</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;