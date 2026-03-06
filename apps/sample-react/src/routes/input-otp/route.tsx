import { Button, ButtonGroup } from '@srcube-ui/react';
import { InputOtp } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import type React from 'react';
import { useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/input-otp')({
  component: InputOtpDemo,
});

const inputOtpColorGroups = [
  [
    { label: 'default', value: 'default' },
    { label: 'primary', value: 'primary' },
    { label: 'success', value: 'success' },
  ],
  [
    { label: 'secondary', value: 'secondary' },
    { label: 'warning', value: 'warning' },
    { label: 'danger', value: 'danger' },
  ],
] as const;

type InputOtpColor = (typeof inputOtpColorGroups)[number][number]['value'];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      {description ? (
        <div className="mt-1 text-xs text-slate-500">{description}</div>
      ) : null}
      <div className="mt-3 flex flex-col gap-3">{children}</div>
    </section>
  );
}

function InputOtpDemo() {
  const [value, setValue] = useState('');
  const [completeValue, setCompleteValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [activeColor, setActiveColor] = useState<InputOtpColor>('default');
  const [colorValue, setColorValue] = useState('12');

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Input OTP" />
      <div className="px-4 pb-8">
        <Section title="Basic" description="controlled + onComplete + length=6">
          <InputOtp
            value={value}
            length={6}
            variant="outline"
            onValueChange={setValue}
            onComplete={setCompleteValue}
          />
          <div className="text-xs text-slate-500">Value: {value || 'empty'}</div>
          <div className="text-xs text-slate-500">
            Completed: {completeValue || 'not completed'}
          </div>
        </Section>

        <Section title="Variants" description="default / outline / twotone / underline">
          <InputOtp defaultValue="12" />
          <InputOtp defaultValue="12" variant="outline" />
          <InputOtp defaultValue="12" variant="twotone" />
          <InputOtp defaultValue="12" variant="underline" />
        </Section>

        <Section title="Sizes" description="sm / md / lg">
          <InputOtp size="sm" defaultValue="123" />
          <InputOtp size="md" defaultValue="123" />
          <InputOtp size="lg" defaultValue="123" />
        </Section>

        <Section title="States" description="disabled / readOnly / password">
          <InputOtp isDisabled defaultValue="1234" />
          <InputOtp isReadOnly defaultValue="5678" />
          <InputOtp
            isPassword
            value={passwordValue}
            onValueChange={setPasswordValue}
          />
        </Section>

        <Section
          title="Colors"
          description="use 2 sm ButtonGroup to switch color"
        >
          <div className="w-full">
            <div className="flex flex-col gap-2">
              {inputOtpColorGroups.map((group, groupIndex) => (
                <ButtonGroup
                  key={`input-otp-color-group-${groupIndex}`}
                  size="sm"
                  isBlock
                >
                  {group.map((item) => (
                    <Button
                      key={item.value}
                      color={activeColor === item.value ? item.value : 'default'}
                      variant={activeColor === item.value ? 'solid' : 'flat'}
                      onTap={() => {
                        setActiveColor(item.value);
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </ButtonGroup>
              ))}
            </div>

            <InputOtp
              className="mt-3"
              color={activeColor}
              value={colorValue}
              onValueChange={setColorValue}
            />

            <div className="mt-2 text-xs text-slate-500">
              Color: {activeColor} / Value: {colorValue || 'empty'}
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}
