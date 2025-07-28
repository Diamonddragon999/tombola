import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { Err } from "./Err";
import { SocialCheck } from "./SocialCheck";
import { useJoinForm } from "./useJoinForm";

/**
 * Mobile‑first, super clean version. 0 goofy gradients, 0 random margins.
 * Everything sits in a centered column, readable on any phone.
 * Keep the business logic intact (useJoinForm, SocialCheck, Err etc.).
 */
export default function JoinFormUI() {
  const { data, setData, errors, state, submit, prizeWon } = useJoinForm();

  // --- Non‑idle screens (waiting / winner) ---
  if (state !== "idle") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm text-center space-y-6">
          <img
            src="https://rovision.ro/wp-content/themes/storefront-child/rovision-logo.svg"
            alt="RoVision"
            className="h-12 mx-auto"
          />
          <h1 className="text-xl font-semibold text-gray-900">
            {state === "waiting" ? "Așteptăm rândul tău…" : "Felicitări!"}
          </h1>
          <p className="text-gray-600">
            {state === "waiting"
              ? "Roata se învârte! Urmărește ecranul mare."
              : `Ai câștigat: ${prizeWon}. Prezintă acest ecran staff‑ului pentru ridicarea premiului.`}
          </p>
        </div>
      </div>
    );
  }

  // --- The actual form ---
  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <header className="max-w-md mx-auto text-center mb-8 space-y-3">
        <img
          src="https://rovision.ro/wp-content/themes/storefront-child/rovision-logo.svg"
          alt="RoVision"
          className="h-12 mx-auto"
        />
        <h1 className="text-2xl font-semibold text-gray-900">Young Festival 2025</h1>
        <p className="text-sm font-medium text-amber-500">Roata Norocului</p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="max-w-md mx-auto space-y-6"
      >
        {/* Name fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="fn" className="text-gray-900">Prenume *</Label>
            <Input
              id="fn"
              value={data.firstName}
              onChange={(e) => setData({ ...data, firstName: e.target.value })}
              className="h-11 rounded-xl bg-gray-100 border-gray-200 focus-visible:ring-2 focus-visible:ring-indigo-500"
            />
            {errors.firstName && <Err msg={errors.firstName} />}
          </div>
          <div className="space-y-1">
            <Label htmlFor="ln" className="text-gray-900">Nume *</Label>
            <Input
              id="ln"
              value={data.lastName}
              onChange={(e) => setData({ ...data, lastName: e.target.value })}
              className="h-11 rounded-xl bg-gray-100 border-gray-200 focus-visible:ring-2 focus-visible:ring-indigo-500"
            />
            {errors.lastName && <Err msg={errors.lastName} />}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <Label htmlFor="em" className="text-gray-900">Email *</Label>
          <Input
            id="em"
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="h-11 rounded-xl bg-gray-100 border-gray-200 focus-visible:ring-2 focus-visible:ring-indigo-500"
          />
          {errors.email && <Err msg={errors.email} />}
        </div>

        {/* Age */}
        <div className="space-y-1">
          <Label htmlFor="age" className="text-gray-900">Vârsta *</Label>
          <Input
            id="age"
            type="number"
            value={data.age}
            onChange={(e) => setData({ ...data, age: e.target.value })}
            className="h-11 rounded-xl bg-gray-100 border-gray-200 focus-visible:ring-2 focus-visible:ring-indigo-500"
          />
          {errors.age && <Err msg={errors.age} />}
        </div>

        {/* Socials */}
        <fieldset className="space-y-3">
          <legend className="text-gray-900 font-medium mb-1">Urmărește‑ne *</legend>
          <SocialCheck
            id="fb"
            tone="blue"
            checked={data.followsFacebook}
            icon={<Facebook className="h-4 w-4" />}
            text="Like pe Facebook"
            url="https://www.facebook.com/SistemeDeSupraveghereVideo"
            onToggle={(v) => setData({ ...data, followsFacebook: v })}
          />
          <SocialCheck
            id="ig"
            tone="pink"
            checked={data.followsInstagram}
            icon={<Instagram className="h-4 w-4" />}
            text="Follow pe Instagram"
            url="https://www.instagram.com/rovision_supraveghere_video/"
            onToggle={(v) => setData({ ...data, followsInstagram: v })}
          />
          <SocialCheck
            id="yt"
            tone="red"
            checked={data.followsYoutube}
            icon={<Youtube className="h-4 w-4" />}
            text="Subscribe pe YouTube"
            url="https://www.youtube.com/@rovision1317/"
            onToggle={(v) => setData({ ...data, followsYoutube: v })}
          />
          {errors.social && <Err msg={errors.social} />}
        </fieldset>

        {/* Newsletter */}
        <div className="flex items-center space-x-3">
          <Checkbox
            id="nl"
            checked={data.newsletterConsent}
            onCheckedChange={(v) => setData({ ...data, newsletterConsent: v as boolean })}
            className="border-gray-400 data-[state=checked]:bg-green-600"
          />
          <Label htmlFor="nl" className="text-sm text-gray-900 cursor-pointer">
            Accept newsletter‑ul *
          </Label>
        </div>
        {errors.newsletterConsent && <Err msg={errors.newsletterConsent} />}

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-12 rounded-xl font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:opacity-90"
        >
          Participă la tombola!
        </Button>
      </form>
    </main>
  );
}
