import { Link } from "@remix-run/react";

import { Button } from "@/components/ui/button.tsx";

export default function NoteIndexPage() {
  return (
    <p>
      No note selected. Select a note on the left, or{" "}
      <Link to="new">
        <Button variant="link"> create a new note.</Button>
      </Link>
    </p>
  );
}
