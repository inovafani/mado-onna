/* Mado Onna design-system primitives, ported from _ds_bundle.js.
   No "use client" directive: these render on either side. Pass event handlers only from client components. */
import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  InputHTMLAttributes,
  ReactNode,
  HTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

type DataAttrs = { [key: `data-${string}`]: string | number | boolean | undefined };

const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");

/* Lucide outline glyphs (v0.460.0, ISC), inlined so we don't ship a 200KB icon font for a handful of icons. */
const ICONS: Record<string, string> = {
  "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  "arrow-left": '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  minus: '<path d="M5 12h14"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  bike: '<circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>',
  smartphone: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
  instagram:
    '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  youtube:
    '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
};

export type IconName = keyof typeof ICONS;

export function Icon({ name, size = 16, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cx("mo-icon", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  );
}

type BtnBase = {
  variant?: "outline" | "primary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconRight?: ReactNode;
  block?: boolean;
  magnetic?: boolean;
  children?: ReactNode;
  className?: string;
};

type ButtonProps = BtnBase &
  ((Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & { href?: undefined }) |
    (Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & { href: string; disabled?: boolean }));

export function Button(props: ButtonProps) {
  const { variant = "outline", size = "md", icon, iconRight, block, magnetic, className, children, ...rest } = props;
  const cls = cx(
    "mo-btn",
    variant !== "outline" && "mo-btn--" + variant,
    size !== "md" && "mo-btn--" + size,
    block && "mo-btn--block",
    !!iconRight && "mo-btn--has-arrow",
    className,
  );
  const inner = (
    <>
      {icon}
      <span className="mo-btn__label">{children}</span>
      {iconRight && <span className="mo-btn__icon">{iconRight}</span>}
    </>
  );
  const mag = magnetic ? { "data-magnetic": "" } : {};
  if ("href" in rest && rest.href) {
    const { disabled, href, ...a } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { disabled?: boolean; href: string };
    // Internal routes go through next/link for client-side navigation; anchors and external URLs stay plain.
    const Tag = href.startsWith("/") ? Link : "a";
    return (
      <Tag href={href} className={cls} aria-disabled={disabled || undefined} {...mag} {...a}>
        {inner}
      </Tag>
    );
  }
  return (
    <button type="button" className={cls} {...mag} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  );
}

export function IconButton({
  icon,
  label,
  size = "md",
  variant = "outline",
  className,
  ...rest
}: { icon: IconName; label: string; size?: "sm" | "md"; variant?: "outline" | "ghost" } & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx("mo-iconbtn", size === "sm" && "mo-iconbtn--sm", variant === "ghost" && "mo-iconbtn--ghost", className)}
      {...rest}
    >
      <Icon name={icon} size={size === "sm" ? 14 : 16} />
    </button>
  );
}

const fieldId = (label?: string, id?: string) => id || (label ? "mo-" + label.toLowerCase().replace(/\W+/g, "-") : undefined);

export function Input({
  label,
  hint,
  error,
  id,
  className,
  ...rest
}: { label?: string; hint?: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const _id = fieldId(label, id);
  return (
    <div className={cx("mo-field", className)}>
      {label && (
        <label className="mo-field__label" htmlFor={_id}>
          {label}
        </label>
      )}
      <input id={_id} className="mo-input" aria-invalid={error ? true : undefined} {...rest} />
      {(error || hint) && <span className={cx("mo-field__hint", error && "mo-field__hint--error")}>{error || hint}</span>}
    </div>
  );
}

export function Select({
  label,
  hint,
  options = [],
  id,
  className,
  ...rest
}: { label?: string; hint?: string; options: string[] } & SelectHTMLAttributes<HTMLSelectElement>) {
  const _id = fieldId(label, id);
  return (
    <div className={cx("mo-field", className)}>
      {label && (
        <label className="mo-field__label" htmlFor={_id}>
          {label}
        </label>
      )}
      <div className="mo-select">
        <select id={_id} className="mo-input" {...rest}>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <Icon name="chevron-down" />
      </div>
      {hint && <span className="mo-field__hint">{hint}</span>}
    </div>
  );
}

export function Textarea({
  label,
  id,
  className,
  ...rest
}: { label?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const _id = fieldId(label, id);
  return (
    <div className={cx("mo-field", className)}>
      {label && (
        <label className="mo-field__label" htmlFor={_id}>
          {label}
        </label>
      )}
      <textarea id={_id} className="mo-input mo-textarea" {...rest} />
    </div>
  );
}

export function Checkbox({ label, className, ...rest }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cx("mo-check", className)}>
      <input type="checkbox" {...rest} />
      <span className="mo-check__box">
        <Icon name="check" size={12} />
      </span>
      {label}
    </label>
  );
}

/* ---------- page-level helpers ---------- */

export function Eyebrow({
  children,
  tone = "mute",
  className,
  ...rest
}: { tone?: "mute" | "ink" | "body" } & HTMLAttributes<HTMLSpanElement> & DataAttrs) {
  return (
    <span className={cx("eyebrow", tone !== "mute" && "eyebrow--" + tone, className)} {...rest}>
      {children}
    </span>
  );
}

export function LineLink({
  href,
  children,
  className,
  ...rest
}: { href: string } & AnchorHTMLAttributes<HTMLAnchorElement> & DataAttrs) {
  const Tag = href.startsWith("/") ? Link : "a";
  return (
    <Tag href={href} className={cx("line-link", className)} {...rest}>
      <span className="line-link__rule" aria-hidden="true" />
      <span>{children}</span>
    </Tag>
  );
}

/**
 * Image frame. `reveal` wipes it in with a clip-path as it enters; `parallax` drifts the
 * picture inside the frame while scrolling (value is the drift as a fraction of frame height).
 */
export function Media({
  src,
  alt,
  ratio,
  arch,
  reveal = true,
  parallax = 0.06,
  speed,
  delay,
  className,
  style,
  loading = "lazy",
}: {
  src: string;
  alt: string;
  ratio?: string;
  arch?: boolean;
  reveal?: boolean;
  parallax?: number;
  speed?: number;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  loading?: "lazy" | "eager";
}) {
  return (
    <div
      className={cx("media", arch && "media--arch", className)}
      style={{ aspectRatio: ratio, ...style }}
      data-reveal-media={reveal ? "" : undefined}
      data-speed={speed}
      data-delay={delay}
    >
      <div className="media__inner" data-parallax={parallax || undefined}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading={loading} decoding="async" />
      </div>
    </div>
  );
}
