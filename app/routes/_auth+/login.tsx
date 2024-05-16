import { useForm, getInputProps } from "@conform-to/react";
import { parseWithZod, getZodConstraint } from "@conform-to/zod";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button.tsx";
import { CheckboxField, Field } from "~/components/forms.tsx";
import { createUserSession, getUserId } from "~/utils/session.server.ts";
import { verifyLogin } from "~/utils/user.server.ts";

export const LoginSchema = z.object({
  email: z.string(),
  password: z.string().min(8),
  redirectTo: z.string().optional(),
  remember: z.string().optional(),
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: LoginSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { email, password, redirectTo, remember } = submission.value;
  const user = await verifyLogin(email, password);

  if (!user) {
    return submission.reply({
      formErrors: ["Invalid email or password"],
    });
  }

  return createUserSession({
    redirectTo: redirectTo || "/",
    remember: remember === "on",
    request,
    userId: user.id,
  });
};

export const meta: MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/notes";
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    id: "login-form",
    constraint: getZodConstraint(LoginSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginSchema });
    },
    shouldRevalidate: "onBlur",
  });
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fields.email.errors) {
      emailRef.current?.focus();
    } else if (fields.password.errors) {
      passwordRef.current?.focus();
    }
  }, [fields]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form
          method="post"
          className="space-y-6"
          id={form.id}
          aria-invalid={form.errors ? true : undefined}
          aria-describedby={form.errors ? form.errorId : undefined}
        >
          <div id={form.errorId} className="pt-1 text-red-700">
            {form.errors}
          </div>

          <Field
            labelProps={{ children: "Email address" }}
            inputProps={{ ...getInputProps(fields.email, { type: "email" }) }}
            field={fields.email}
          />

          <Field
            labelProps={{ children: "Password" }}
            inputProps={getInputProps(fields.password, { type: "password" })}
            field={fields.password}
          />

          <input type="hidden" name="redirectTo" value={redirectTo} />

          <Button type="submit" className="w-full ">
            Log in
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckboxField
                labelProps={{ children: "Remember me" }}
                checkboxProps={getInputProps(fields.remember, {
                  type: "checkbox",
                })}
                field={fields.remember}
              />
            </div>
            <div className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                to={{
                  pathname: "/join",
                  search: searchParams.toString(),
                }}
              >
                <Button variant="link">Sign up</Button>
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
