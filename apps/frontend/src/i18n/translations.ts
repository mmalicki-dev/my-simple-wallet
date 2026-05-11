export const translations = {
  en: {
    common: {
      email: "Email",
      password: "Password",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      create: "Create",
      name: "Name",
    },
    auth: {
      signIn: "Sign in",
      register: "Register",
      createAccount: "Create account",
      rememberMe: "Remember me",
      loginError: "Invalid email or password.",
      registerError: "Registration failed. Try again.",
      checkEmailTitle: "Check your inbox",
      checkEmailMessage: "We sent a verification link to your email. Click it to activate your account.",
      goToSignIn: "Go to Sign In",
    },
  },
  pl: {
    common: {
      email: "Email",
      password: "Hasło",
      save: "Zapisz",
      cancel: "Anuluj",
      delete: "Usuń",
      edit: "Edytuj",
      create: "Utwórz",
      name: "Imię",
    },
    auth: {
      signIn: "Zaloguj",
      register: "Rejestracja",
      createAccount: "Utwórz konto",
      rememberMe: "Zapamiętaj mnie",
      loginError: "Nieprawidłowy email lub hasło.",
      registerError: "Rejestracja nie powiodła się. Spróbuj ponownie.",
      checkEmailTitle: "Sprawdź skrzynkę",
      checkEmailMessage: "Wysłaliśmy link weryfikacyjny na Twój adres email. Kliknij go, aby aktywować konto.",
      goToSignIn: "Przejdź do logowania",
    },
  },
  no: {
    common: {
      email: "E-post",
      password: "Passord",
      save: "Lagre",
      cancel: "Avbryt",
      delete: "Slett",
      edit: "Rediger",
      create: "Opprett",
      name: "Navn",
    },
    auth: {
      signIn: "Logg inn",
      register: "Registrer",
      createAccount: "Opprett konto",
      rememberMe: "Husk meg",
      loginError: "Ugyldig e-post eller passord.",
      registerError: "Registrering mislyktes. Prøv igjen.",
      checkEmailTitle: "Sjekk innboksen din",
      checkEmailMessage: "Vi sendte en bekreftelseslenke til e-posten din. Klikk på den for å aktivere kontoen.",
      goToSignIn: "Gå til innlogging",
    },
  },
}

export type Language = keyof typeof translations
export type Translations = (typeof translations)[Language]
