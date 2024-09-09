import AuthForm from "@/components/auth/AuthForm";

export default function Auth() {
  // Variables:

  return (
    <div className="min-h-[100vh] items-center flex flex-col justify-center space-y-4">
      <div className="flex flex-col justify-center space-y-4 items-center ">
        <img className="h-16 w-16" src="/images/test-quac-logo.png" />
        <AuthForm />
      </div>
    </div>
  );
}
