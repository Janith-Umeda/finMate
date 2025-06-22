import { KeyboardAvoidingView, Platform, ScrollView, } from 'react-native';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  </KeyboardAvoidingView>
};

