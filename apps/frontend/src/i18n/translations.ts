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
    },
  },
}

export type Language = keyof typeof translations
export type Translations = (typeof translations)[Language]
