 "use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  year: string;
  major: string;
  previousProgrammingExperience: boolean;
  programmingLanguages: string[];
  specialAccommodations: string;
  agreeToTerms: boolean;
}

const programmingLanguageOptions = [
  'JavaScript/TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'Ruby',
  'Go',
  'Rust',
  'Swift',
  'Other'
];

const yearOptions = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'Other'];

export default function StudentRegistrationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});
  
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    year: '',
    major: '',
    previousProgrammingExperience: false,
    programmingLanguages: [],
    specialAccommodations: '',
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
    if (errors[name as keyof StudentFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleProgrammingLanguageChange = (language: string) => {
    setFormData(prev => {
      const isSelected = prev.programmingLanguages.includes(language);
      return {
        ...prev,
        programmingLanguages: isSelected
          ? prev.programmingLanguages.filter(lang => lang !== language)
          : [...prev.programmingLanguages, language]
      };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof StudentFormData, string>> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!formData.year) newErrors.year = 'Please select your year';
    if (!formData.major.trim()) newErrors.major = 'Major is required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';

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
      // In a real application, you would send this to your backend API
      const response = await axios.post('/api/students/register', formData);
      
      if (response.status === 201) {
        setSubmitMessage('Registration successful! Welcome to the Software Engineering lecture.');
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          studentId: '',
          year: '',
          major: '',
          previousProgrammingExperience: false,
          programmingLanguages: [],
          specialAccommodations: '',
          agreeToTerms: false,
        });
        
        // Optional: Redirect to confirmation page or dashboard
        // router.push('/registration-success');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitMessage('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Software Engineering Lecture Registration
          </h1>
          <p className="text-lg text-gray-600">
            Register for our comprehensive software engineering course covering modern development practices
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b">
                Personal Information
              </h2>
              
              <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:flex-wrap md:justify-between">
                {/* First Name */}
                <div className="w-full md:w-[48%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="w-full md:w-[48%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>

                {/* Spacer for the next row */}
                <div className="w-full h-0 md:h-6"></div>

                {/* Email */}
                <div className="w-full md:w-[48%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="student@university.edu"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Student ID */}
                <div className="w-full md:w-[48%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.studentId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your student ID"
                  />
                  {errors.studentId && (
                    <p className="mt-2 text-sm text-red-600">{errors.studentId}</p>
                  )}
                </div>

                {/* Spacer for the next row */}
                <div className="w-full h-0 md:h-6"></div>

                {/* Year */}
                <div className="w-full md:w-[48%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year *
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.year ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select your year</option>
                    {yearOptions.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.year && (
                    <p className="mt-2 text-sm text-red-600">{errors.year}</p>
                  )}
                </div>

                {/* Major */}
                <div className="w-full md:w-[48%]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Major *
                  </label>
                  <input
                    type="text"
                    name="major"
                    value={formData.major}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.major ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Computer Science"
                  />
                  {errors.major && (
                    <p className="mt-2 text-sm text-red-600">{errors.major}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Programming Experience Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b">
                Programming Experience
              </h2>

              {/* Previous Experience */}
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    id="previousProgrammingExperience"
                    name="previousProgrammingExperience"
                    checked={formData.previousProgrammingExperience}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <label htmlFor="previousProgrammingExperience" className="text-lg font-medium text-gray-700">
                    I have previous programming experience
                  </label>
                </div>
                
                {formData.previousProgrammingExperience && (
                  <div className="ml-8 mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select programming languages you're familiar with:
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {programmingLanguageOptions.map(language => (
                        <div key={language} className="flex items-center w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(20%-16px)]">
                          <input
                            type="checkbox"
                            id={`lang-${language}`}
                            checked={formData.programmingLanguages.includes(language)}
                            onChange={() => handleProgrammingLanguageChange(language)}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          <label htmlFor={`lang-${language}`} className="ml-2 text-sm text-gray-700">
                            {language}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Special Accommodations */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b">
                Additional Information
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Accommodations or Notes (Optional)
                </label>
                <textarea
                  name="specialAccommodations"
                  value={formData.specialAccommodations}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Please let us know if you require any special accommodations or have additional notes..."
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-blue-50 p-6 rounded-lg">
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
                    I agree to the terms and conditions *
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    By checking this box, I acknowledge that I have read and agree to the course policies, 
                    including attendance requirements, code of conduct, and data privacy policy. I understand 
                    that this registration is for the Software Engineering lecture and commit to actively 
                    participate in the course.
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
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white shadow-md hover:shadow-lg`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Processing Registration...
                  </span>
                ) : (
                  'Register for Software Engineering Lecture'
                )}
              </button>

              <p className="text-center text-gray-500 text-sm mt-4">
                * Required fields
              </p>
            </div>
          </form>
        </div>

        {/* Course Info Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>
            Questions? Contact the instructor at{' '}
            <a href="mailto:instructor@university.edu" className="text-blue-600 hover:underline">
              instructor@university.edu
            </a>
          </p>
          <p className="mt-1">
            Lecture schedule: Mondays & Wednesdays, 10:00 AM - 11:30 AM | Room: CS-101
          </p>
        </div>
      </div>
    </div>
  );
}