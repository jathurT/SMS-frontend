import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";

interface Lecturer {
  lecturerId: number;
  firstName: string;
  lastName: string;
  email: string;
  departmentName?: string;
}

interface LecturerDropdownProps {
  value: string;
  onChange: (lecturerId: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function LecturerSearchableDropdown({ 
  value, 
  onChange, 
  disabled = false, 
  placeholder = "Search lecturer by name or select..." 
}: LecturerDropdownProps) {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch lecturers on mount
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/lecturers/all');
        const lecturerData = response.data.body || response.data || [];
        setLecturers(lecturerData);
        
        // If there's a value, find and set the selected lecturer
        if (value) {
          const selected = lecturerData.find((l: Lecturer) => l.lecturerId.toString() === value);
          if (selected) {
            setSelectedLecturer(selected);
            setSearchTerm(`${selected.firstName} ${selected.lastName}`);
          }
        }
      } catch (error) {
        console.error("Error fetching lecturers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLecturers();
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter lecturers based on search term
  const filteredLecturers = lecturers.filter(lecturer =>
    `${lecturer.firstName} ${lecturer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lecturer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lecturer.departmentName && lecturer.departmentName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelect = (lecturer: Lecturer) => {
    setSelectedLecturer(lecturer);
    setSearchTerm(`${lecturer.firstName} ${lecturer.lastName}`);
    onChange(lecturer.lecturerId.toString());
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    
    // If input is cleared, clear selection
    if (!newValue) {
      setSelectedLecturer(null);
      onChange("");
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Input Field */}
      <div className="relative">
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled || loading}
          className="pr-10"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {loading ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          ) : (
            <ChevronDown 
              className={`h-4 w-4 text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-64 overflow-auto">
          {filteredLecturers.length > 0 ? (
            <>
              {/* Search hint */}
              {searchTerm && (
                <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-700 border-b">
                  <Search className="inline w-3 h-3 mr-1" />
                  {filteredLecturers.length} lecturer{filteredLecturers.length !== 1 ? 's' : ''} found
                </div>
              )}
              
              {filteredLecturers.map((lecturer) => (
                <div
                  key={lecturer.lecturerId}
                  className={`px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    selectedLecturer?.lecturerId === lecturer.lecturerId 
                      ? 'bg-blue-50 dark:bg-blue-900/20' 
                      : ''
                  }`}
                  onClick={() => handleSelect(lecturer)}
                >
                  <div className="flex items-center gap-3">
                    {/* Lecturer Avatar */}
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {lecturer.firstName[0]}{lecturer.lastName[0]}
                    </div>
                    
                    {/* Lecturer Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {lecturer.firstName} {lecturer.lastName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {lecturer.email}
                      </div>
                      {lecturer.departmentName && (
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {lecturer.departmentName} • ID: {lecturer.lecturerId}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">
                {searchTerm 
                  ? `No lecturers found matching "${searchTerm}"` 
                  : 'No lecturers available'
                }
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Lecturer Preview (Optional) */}
      {selectedLecturer && !isOpen && (
        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {selectedLecturer.firstName[0]}{selectedLecturer.lastName[0]}
            </div>
            <span className="font-medium text-blue-900 dark:text-blue-100">
              {selectedLecturer.firstName} {selectedLecturer.lastName}
            </span>
            <span className="text-blue-600 dark:text-blue-400">
              (ID: {selectedLecturer.lecturerId})
            </span>
          </div>
        </div>
      )}
    </div>
  );
}