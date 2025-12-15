"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Building2, Users, Calendar, Phone, Mail, MapPin, Bed, User } from 'lucide-react';

interface DormMateFormData {
  fullName: string;
  studentId: string;
  email: string;
  phoneNumber: string;
  yearOfStudy: string;
  department: string;
  program: string;
  bedNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  arrivalDate: string;
  departureDate: string;
  specialRequirements: string;
  agreeToTerms: boolean;
}

const yearOfStudyOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduate'];
const departmentOptions = [
  'School of Engineering',
  'School of Law',
  'School of Business',
  'School of Medicine',
  'School of Social Sciences',
  'School of Natural Sciences',
  'School of Technology',
  'Other'
];
const programOptions = [
  'Computer Science',
  'Software Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Law',
  'Business Administration',
  'Medicine',
  'Pharmacy',
  'Architecture',
  'Other'
];
const bedOptions = ['Bed 1', 'Bed 2', 'Bed 3', 'Bed 4'];

export default function DormRegistrationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof DormMateFormData, string>>>({});
  
  const [formData, setFormData] = useState<DormMateFormData>({
    fullName: '',
    studentId: '',
    email: '',
    phoneNumber: '',
    yearOfStudy: '',
    department: '',
    program: '',
    bedNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    arrivalDate: '',
    departureDate: '',
    specialRequirements: '',
    agreeToTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field if it exists
    if (errors[name as keyof DormMateFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof DormMateFormData, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    
    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    } else if (!/^[A-Za-z0-9]{6,12}$/.test(formData.studentId)) {
      newErrors.studentId = 'Please enter a valid AAU student ID';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (!formData.email.includes('@aau.edu.et') && !formData.email.includes('@students.aau.edu.et')) {
      newErrors.email = 'Please use your AAU email address';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^(\+251|0)[79]\d{8}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid Ethiopian phone number';
    }

    if (!formData.yearOfStudy) newErrors.yearOfStudy = 'Year of study is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.program) newErrors.program = 'Program is required';
    if (!formData.bedNumber) newErrors.bedNumber = 'Bed number is required';
    if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact name is required';
    
    if (!formData.emergencyContactPhone.trim()) {
      newErrors.emergencyContactPhone = 'Emergency contact phone is required';
    } else if (!/^(\+251|0)[79]\d{8}$/.test(formData.emergencyContactPhone.replace(/\s/g, ''))) {
      newErrors.emergencyContactPhone = 'Please enter a valid Ethiopian phone number';
    }

    if (!formData.arrivalDate) newErrors.arrivalDate = 'Arrival date is required';
    if (!formData.departureDate) newErrors.departureDate = 'Departure date is required';
    
    if (formData.arrivalDate && formData.departureDate) {
      const arrival = new Date(formData.arrivalDate);
      const departure = new Date(formData.departureDate);
      if (departure < arrival) {
        newErrors.departureDate = 'Departure date must be after arrival date';
      }
    }

    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the dormitory rules';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitMessage('Please fix the errors above');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await axios.post('/api/dorm/register', {
        ...formData,
        dormBlock: 'B',
        roomNumber: '9',
        university: 'Addis Ababa University'
      });
      
      if (response.status === 201) {
        setSubmitMessage('Registration successful! Welcome to B Block, Room 9 at AAU.');
        
        // Reset form
        setFormData({
          fullName: '',
          studentId: '',
          email: '',
          phoneNumber: '',
          yearOfStudy: '',
          department: '',
          program: '',
          bedNumber: '',
          emergencyContactName: '',
          emergencyContactPhone: '',
          arrivalDate: '',
          departureDate: '',
          specialRequirements: '',
          agreeToTerms: false,
        });
        
        // Redirect to success page
        setTimeout(() => {
          router.push('/registration-success');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with AAU Theme */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600 mr-3" />
            <Users className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AAU Dormitory Registration
          </h1>
          <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 inline-block mb-4">
            <div className="flex items-center justify-center space-x-4">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold text-blue-800">
                B Block • Room 9 • Addis Ababa University
              </span>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Register as a dorm mate for the current academic semester. All fields marked with * are required.
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white shadow-2xl rounded-2xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div>
              <div className="flex items-center mb-6 pb-3 border-b">
                <User className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Personal Information
                </h2>
              </div>
              
              <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:flex-wrap md:justify-between">
                {/* Full Name */}
                <div className="w-full md:w-[48%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                {/* Student ID */}
                <div className="w-full md:w-[48%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AAU Student ID *
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.studentId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., ATR/1234/14"
                  />
                  {errors.studentId && (
                    <p className="mt-2 text-sm text-red-600">{errors.studentId}</p>
                  )}
                </div>

                <div className="w-full h-0 md:h-6"></div>

                {/* Email */}
                <div className="w-full md:w-[48%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AAU Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="username@students.aau.edu.et"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="w-full md:w-[48%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                        errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                      placeholder="+251 9XX XXX XXX"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <div className="flex items-center mb-6 pb-3 border-b">
                <Building2 className="h-6 w-6 text-green-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Academic Information
                </h2>
              </div>
              
              <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:flex-wrap md:justify-between">
                {/* Year of Study */}
                <div className="w-full md:w-[48%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year of Study *
                  </label>
                  <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.yearOfStudy ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select year</option>
                    {yearOfStudyOptions.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.yearOfStudy && (
                    <p className="mt-2 text-sm text-red-600">{errors.yearOfStudy}</p>
                  )}
                </div>

                {/* Department */}
                <div className="w-full md:w-[48%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department/School *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.department ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select department</option>
                    {departmentOptions.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="mt-2 text-sm text-red-600">{errors.department}</p>
                  )}
                </div>

                <div className="w-full h-0 md:h-6"></div>

                {/* Program */}
                <div className="w-full md:w-[48%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program *
                  </label>
                  <select
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.program ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select program</option>
                    {programOptions.map(program => (
                      <option key={program} value={program}>{program}</option>
                    ))}
                  </select>
                  {errors.program && (
                    <p className="mt-2 text-sm text-red-600">{errors.program}</p>
                  )}
                </div>

                {/* Bed Number */}
                <div className="w-full md:w-[48%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bed Number in Room 9 *
                  </label>
                  <div className="relative">
                    <Bed className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <select
                      name="bedNumber"
                      value={formData.bedNumber}
                      onChange={handleInputChange}
                      className={`w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                        errors.bedNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select bed</option>
                      {bedOptions.map(bed => (
                        <option key={bed} value={bed}>{bed}</option>
                      ))}
                    </select>
                  </div>
                  {errors.bedNumber && (
                    <p className="mt-2 text-sm text-red-600">{errors.bedNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <div className="flex items-center mb-6 pb-3 border-b">
                <Phone className="h-6 w-6 text-red-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Emergency Contact
                </h2>
              </div>
              
              <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:flex-wrap md:justify-between">
                {/* Emergency Contact Name */}
                <div className="w-full md:w-[48%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.emergencyContactName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Full name of emergency contact"
                  />
                  {errors.emergencyContactName && (
                    <p className="mt-2 text-sm text-red-600">{errors.emergencyContactName}</p>
                  )}
                </div>

                {/* Emergency Contact Phone */}
                <div className="w-full md:w-[48%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.emergencyContactPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+251 9XX XXX XXX"
                  />
                  {errors.emergencyContactPhone && (
                    <p className="mt-2 text-sm text-red-600">{errors.emergencyContactPhone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Stay Duration */}
            <div>
              <div className="flex items-center mb-6 pb-3 border-b">
                <Calendar className="h-6 w-6 text-purple-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Stay Duration
                </h2>
              </div>
              
              <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:flex-wrap md:justify-between">
                {/* Arrival Date */}
                <div className="w-full md:w-[48%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arrival Date *
                  </label>
                  <input
                    type="date"
                    name="arrivalDate"
                    value={formData.arrivalDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.arrivalDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.arrivalDate && (
                    <p className="mt-2 text-sm text-red-600">{errors.arrivalDate}</p>
                  )}
                </div>

                {/* Departure Date */}
                <div className="w-full md:w-[48%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Date *
                  </label>
                  <input
                    type="date"
                    name="departureDate"
                    value={formData.departureDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.departureDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.departureDate && (
                    <p className="mt-2 text-sm text-red-600">{errors.departureDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Special Requirements */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b">
                Additional Information
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements or Medical Conditions (Optional)
                </label>
                <textarea
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Please let us know about any special requirements, medical conditions, allergies, or other important information..."
                />
              </div>
            </div>

            {/* Dormitory Rules Agreement */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-bold text-blue-800 mb-4">Dormitory Rules & Regulations</h3>
              <div className="space-y-3 mb-4 text-sm text-gray-700">
                <p>✓ Quiet hours are from 10:00 PM to 6:00 AM</p>
                <p>✓ No overnight guests without prior approval</p>
                <p>✓ Keep common areas clean and tidy</p>
                <p>✓ Report maintenance issues immediately</p>
                <p>✓ No cooking in bedrooms (use designated kitchen areas)</p>
                <p>✓ Respect other residents' privacy and property</p>
                <p>✓ No smoking or alcohol in dormitory premises</p>
                <p>✓ Electricity and water conservation is mandatory</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-blue-600 rounded mt-1"
                />
                <div>
                  <label htmlFor="agreeToTerms" className="text-sm font-medium text-gray-700">
                    I agree to abide by all AAU dormitory rules and regulations *
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    By checking this box, I acknowledge that I have read and agree to all dormitory rules,
                    understand the code of conduct, and commit to maintaining a respectful living environment
                    at B Block, Room 9. I also agree to the data privacy policy of Addis Ababa University.
                  </p>
                  {errors.agreeToTerms && (
                    <p className="mt-2 text-sm text-red-600">{errors.agreeToTerms}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button and Status Message */}
            <div className="pt-6 border-t">
              {submitMessage && (
                <div className={`mb-6 p-4 rounded-lg ${
                  submitMessage.includes('successful') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {submitMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition flex items-center justify-center ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700'
                } text-white shadow-lg hover:shadow-xl`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Processing Registration...
                  </>
                ) : (
                  <>
                    <Building2 className="h-5 w-5 mr-2" />
                    Register for B Block, Room 9
                  </>
                )}
              </button>

              <p className="text-center text-gray-500 text-sm mt-4">
                * Required fields
              </p>
            </div>
          </form>
        </div>

        {/* Contact Information Footer */}
        <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Need Assistance?</h3>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-gray-700">AAU Dormitory Office</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-gray-700">+251 11 123 4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-gray-700">dormitory@aau.edu.et</span>
              </div>
            </div>
            <p className="mt-4 text-gray-600 text-sm">
              Office Hours: Monday - Friday, 8:30 AM - 5:00 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
