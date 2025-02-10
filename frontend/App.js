import React from "react";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context"; // ✅ Import SafeAreaProvider
import store from "./src/store/store";
import HomeScreen from "./src/screens/HomeScreen";

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <HomeScreen />
      </SafeAreaProvider>
    </Provider>
  );
}
