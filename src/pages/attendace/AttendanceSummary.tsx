import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface AttendanceSummaryProps {
  presentCount: number;
  absentCount: number;
}

export const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({
  presentCount,
  absentCount
}) => {
  const totalStudents = presentCount + absentCount;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Attendance Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {presentCount}
            </div>
            <div className="text-sm text-muted-foreground">Present</div>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {absentCount}
            </div>
            <div className="text-sm text-muted-foreground">Absent</div>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {attendanceRate}%
            </div>
            <div className="text-sm text-muted-foreground">Attendance Rate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};