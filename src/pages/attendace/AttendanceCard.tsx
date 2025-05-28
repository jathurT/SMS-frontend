import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, UserX } from "lucide-react";
import { AttendanceRecord, NonAttendingStudent } from "@/types/attendance";

interface AttendanceCardProps {
  attendance?: AttendanceRecord;
  student?: NonAttendingStudent;
  type: 'attending' | 'non-attending';
  onRemove?: (studentId: number) => void;
  onAdd?: (studentId: number) => void;
  isLoading?: boolean;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  attendance,
  student,
  type,
  onRemove,
  onAdd,
  isLoading = false
}) => {
  if (type === 'attending' && attendance) {
    return (
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div>
          <p className="font-medium">{attendance.studentName}</p>
          <p className="text-sm text-muted-foreground">
            Student ID: {attendance.studentId}
          </p>
        </div>
        <Button
          onClick={() => onRemove?.(attendance.studentId)}
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
          disabled={isLoading}
        >
          <UserX className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </div>
    );
  }

  if (type === 'non-attending' && student) {
    return (
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div>
          <p className="font-medium">{student.firstName}</p>
          <p className="text-sm text-muted-foreground">
            Student ID: {student.studentId}
          </p>
          <p className="text-xs text-muted-foreground">
            {student.email}
          </p>
        </div>
        <Button
          onClick={() => onAdd?.(student.studentId)}
          variant="outline"
          size="sm"
          className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
          disabled={isLoading}
        >
          <UserCheck className="h-4 w-4 mr-1" />
          Mark Present
        </Button>
      </div>
    );
  }

  return null;
};