import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';
import * as Yup from 'yup';
import { Href, useRouter } from 'expo-router';
import { validateSchemaPartially } from '../lib/validationHelpers';

// Define the shape of the form data
export interface FormData {
  name: string;
  username: string;
  dateOfBirth: string;
  password: string;
  identifier?: string;
  code: string;
}

// Define the initial state and shape of the state
interface RegistrationState {
  currentStep: number;
  formData: FormData;
  errors: Record<string, string>;
}

const initialState: RegistrationState = {
  currentStep: 0,
  formData: {
    name: '',
    dateOfBirth: '',
    identifier: '',
    code: '',
    password: '',
    username: '',
  },
  errors: {},
};

// Define action types
type RegistrationAction =
  | { type: 'SET_FORM_DATA'; payload: Partial<FormData> }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'CLEAR_FORM_DATA' };

// Reducer function
const registrationReducer = (
  state: RegistrationState,
  action: RegistrationAction,
): RegistrationState => {
  switch (action.type) {
    case 'SET_FORM_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: {
          ...state.errors,
          ...action.payload,
        },
      };
    case 'NEXT_STEP':
      return { ...state, currentStep: state.currentStep + 1 };
    case 'PREV_STEP':
      return { ...state, currentStep: state.currentStep - 1 };
    case 'CLEAR_FORM_DATA':
      return {
        ...state,
        formData: initialState.formData,
        errors: {},
        currentStep: 0,
      };
    default:
      return state;
  }
};

// Define the context value type
interface RegistrationContextProps {
  state: RegistrationState;
  steps: string[];
  setFormData: (newData: Partial<FormData>) => void;
  setErrors: (newErrors: Record<string, string>) => void;
  validateStep: (
    validationSchema: Yup.ObjectSchema<any>,
    fieldsToValidate: Array<keyof FormData>,
    dataToValidate: Partial<FormData>,
  ) => Promise<boolean>;
  handleSubmitStep: (
    validationSchema: Yup.ObjectSchema<any>,
    fieldsToValidate: Array<keyof FormData>,
    formData: Partial<FormData>,
  ) => Promise<void>;
  nextStep: () => void;
  prevStep: () => void;
  clearFormData: () => void;
}

// Create context
const RegistrationContext = createContext<RegistrationContextProps | undefined>(
  undefined,
);

interface RegistrationProviderProps {
  children: ReactNode;
}

// RegistrationProvider component
export const RegistrationProvider: React.FC<RegistrationProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(registrationReducer, initialState);
  const router = useRouter();
  const steps = [
    'Name',
    'Username',
    'Date of birth',
    'Password',
    'Identifer',
    'Confirm',
  ];

  // Function to update form data
  const setFormData = useCallback((newData: Partial<FormData>) => {
    dispatch({ type: 'SET_FORM_DATA', payload: newData });
  }, []);

  // Function to update errors
  const setErrors = useCallback((newErrors: Record<string, string>) => {
    dispatch({ type: 'SET_ERRORS', payload: newErrors });
  }, []);

  // Function to navigate to the next step
  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, []);

  // Function to navigate to the previous step
  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' });
    router.back();
  }, [router]);

  // Function to clear form data
  const clearFormData = useCallback(() => {
    dispatch({ type: 'CLEAR_FORM_DATA' });
  }, []);

  // Function to validate a step
  const validateStep = useCallback(
    async (
      validationSchema: Yup.ObjectSchema<any>,
      fieldsToValidate: Array<keyof FormData>,
      dataToValidate: Partial<FormData>,
    ): Promise<boolean> => {
      const errors = await validateSchemaPartially(
        validationSchema,
        dataToValidate,
        fieldsToValidate,
      );
      if (Object.keys(errors).length === 0) {
        setErrors({});
        return true;
      } else {
        setErrors(errors);
        return false;
      }
    },
    [setErrors],
  );

  // Function to navigate to the appropriate screen
  const goToNextScreen = useCallback(() => {
    const stepRoutes: Record<number, Href> = {
      0: '/auth/register/username',
      1: '/auth/register/date-of-birth',
      2: '/auth/register/password',
      3: '/auth/register/identifier',
      4: '/auth/register/one-time-passcode',
    };

    const nextRoute = stepRoutes[state.currentStep];
    if (nextRoute) {
      router.push(nextRoute);
    } else {
      // router.replace('/app/profile');
    }
  }, [router, state.currentStep]);

  // Function to handle submitting the step
  const handleSubmitStep = useCallback(
    async (
      validationSchema: Yup.ObjectSchema<any>,
      fieldsToValidate: Array<keyof FormData>,
      formData: Partial<FormData>,
    ): Promise<void> => {
      const isValid = await validateStep(
        validationSchema,
        fieldsToValidate,
        formData,
      );
      if (isValid) {
        setFormData(formData);
        if (state.currentStep === steps.length - 1) {
          return;
        }
        nextStep();
        goToNextScreen();
      }
    },
    [validateStep, setFormData, nextStep, goToNextScreen, state.currentStep],
  );

  return (
    <RegistrationContext.Provider
      value={{
        state,
        steps,
        setFormData,
        setErrors,
        validateStep,
        handleSubmitStep,
        nextStep,
        prevStep,
        clearFormData,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

// Hook to use the RegistrationContext
export const useRegistration = (): RegistrationContextProps => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error(
      'useRegistration must be used within a RegistrationProvider',
    );
  }
  return context;
};
