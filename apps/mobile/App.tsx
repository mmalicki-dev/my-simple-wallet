import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'react-redux'
import { store } from './src/redux/store'
import { LanguageProvider } from './src/context/LanguageContext'
import { ThemeProvider } from './src/context/ThemeContext'
import RootNavigator from './src/navigation'

export default function App() {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <ThemeProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </LanguageProvider>
    </Provider>
  )
}
