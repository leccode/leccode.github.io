import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <Container size="narrow" className="flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="text-sm text-muted">404</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">This page doesn’t exist.</h1>
      <p className="mt-4 text-lg text-muted">The link may be old, or the address mistyped.</p>
      <ButtonLink href="/" className="mt-8">
        Go to the home page
      </ButtonLink>
    </Container>
  );
}
