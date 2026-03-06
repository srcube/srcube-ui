import { Button, ButtonGroup } from '@srcube-ui/react';
import { Steps } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/steps')({
  component: StepsDemo,
});

const checkoutSteps = [
  { title: 'Address', description: 'Fill shipping info' },
  {
    title: 'Payment',
    description: (
      <>
        Confirm card details
        <br />
        and billing address
      </>
    ),
  },
  { title: 'Done', description: 'Order created' },
];

const issueSteps = [
  { title: 'Create ticket', description: 'Submit detail', status: 'finish' as const },
  { title: 'Assign owner', description: 'Waiting owner', status: 'error' as const },
  { title: 'Fix & verify', description: 'Pending' },
];

const noDescriptionSteps = [
  { title: 'Plan' },
  { title: 'Build' },
  { title: 'Release' },
];

const stepSizes = ['sm', 'md', 'lg'] as const;
const stepVariants = ['solid', 'outline', 'flat', 'text', 'twotone'] as const;
const stepColorGroups = [
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

type StepSize = (typeof stepSizes)[number];
type StepVariant = (typeof stepVariants)[number];
type StepColor = (typeof stepColorGroups)[number][number]['value'];

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>;
}

function StepsDemo() {
  const [globalSize, setGlobalSize] = useState<StepSize>('md');
  const [globalVariant, setGlobalVariant] = useState<StepVariant>('solid');
  const [globalColor, setGlobalColor] = useState<StepColor>('primary');

  return (
    <main className="min-h-screen bg-slate-100 pb-safe-4 text-slate-900">
      <PageHeader title="Steps" />

      <div className="space-y-6 p-4">
        <Card>
          <div className="text-sm font-semibold">Size</div>
          <div className="mt-1 text-xs text-slate-500">global size control</div>
          <div className="mt-3">
            <ButtonGroup size="sm" isBlock>
              {stepSizes.map((size) => (
                <Button
                  key={size}
                  color={globalSize === size ? 'primary' : 'default'}
                  variant={globalSize === size ? 'solid' : 'flat'}
                  onTap={() => {
                    setGlobalSize(size);
                  }}
                >
                  {size}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Variant</div>
          <div className="mt-1 text-xs text-slate-500">global variant control</div>
          <div className="mt-3 flex flex-col gap-2">
            <ButtonGroup size="sm" isBlock>
              {stepVariants.slice(0, 3).map((variant) => (
                <Button
                  key={variant}
                  color={globalVariant === variant ? 'primary' : 'default'}
                  variant={globalVariant === variant ? 'solid' : 'flat'}
                  onTap={() => {
                    setGlobalVariant(variant);
                  }}
                >
                  {variant}
                </Button>
              ))}
            </ButtonGroup>
            <ButtonGroup size="sm" isBlock>
              {stepVariants.slice(3).map((variant) => (
                <Button
                  key={variant}
                  color={globalVariant === variant ? 'primary' : 'default'}
                  variant={globalVariant === variant ? 'solid' : 'flat'}
                  onTap={() => {
                    setGlobalVariant(variant);
                  }}
                >
                  {variant}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Color</div>
          <div className="mt-1 text-xs text-slate-500">global color control</div>
          <div className="mt-3 flex flex-col gap-2">
            {stepColorGroups.map((group, groupIndex) => (
              <ButtonGroup
                key={`steps-global-color-group-${groupIndex}`}
                size="sm"
                isBlock
              >
                {group.map((option) => (
                  <Button
                    key={option.value}
                    color={globalColor === option.value ? option.value : 'default'}
                    variant={globalColor === option.value ? 'solid' : 'flat'}
                    onTap={() => {
                      setGlobalColor(option.value);
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </ButtonGroup>
            ))}
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Horizontal</div>
          <div className="mt-1 text-xs text-slate-500">uses global size / variant / color</div>
          <div className="mt-3">
            <Steps
              items={checkoutSteps}
              current={1}
              size={globalSize}
              variant={globalVariant}
              color={globalColor}
            />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Vertical</div>
          <div className="mt-1 text-xs text-slate-500">uses global size / variant / color</div>
          <div className="mt-3">
            <Steps
              items={checkoutSteps}
              current={1}
              orientation="y"
              size={globalSize}
              variant={globalVariant}
              color={globalColor}
            />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Vertical Dot</div>
          <div className="mt-1 text-xs text-slate-500">uses global size / color</div>
          <div className="mt-3">
            <Steps
              items={checkoutSteps}
              current={2}
              orientation="y"
              size={globalSize}
              color={globalColor}
              variant={globalVariant}
              isDot
            />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Vertical No Description</div>
          <div className="mt-1 text-xs text-slate-500">items without description</div>
          <div className="mt-3">
            <Steps
              items={noDescriptionSteps}
              current={1}
              orientation="y"
              size={globalSize}
              variant={globalVariant}
              color={globalColor}
            />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Custom Status</div>
          <div className="mt-1 text-xs text-slate-500">with finish / error status</div>
          <div className="mt-3">
            <Steps
              items={issueSteps}
              orientation="y"
              size={globalSize}
              variant={globalVariant}
              color={globalColor}
            />
          </div>
        </Card>
      </div>
    </main>
  );
}
