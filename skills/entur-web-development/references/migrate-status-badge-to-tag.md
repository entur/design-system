# Migrasjon: Badge og Tag (breaking changes)

## Hva endret seg

Komponentene er ryddet opp for å skille semantikk tydelig:

- **Tag** = statuser og kategorilabels («Forsinket», «Planlagt»)
- **Badge** = notification/teller (tall, «!»)

---

## Oversikt over breaking changes

| Hva                 | Endring                                    |
| ------------------- | ------------------------------------------ |
| `StatusBadge`       | Fjernet → bruk `Tag`                       |
| `NotificationBadge` | Fjernet → bruk `Badge type="notification"` |
| `BulletBadge`       | Fjernet → bruk `Badge type="bullet"`       |
| `variant="danger"`  | Fjernet → bruk `variant="negative"`        |
| `variant="info"`    | Fjernet → bruk `variant="information"`     |
| `invisible` prop    | Fjernet → bruk `hide`                      |
| `Tag` props         | `compact` fjernet → bruk `size="small"`    |

---

## StatusBadge → Tag

```tsx
// Før
import { StatusBadge } from '@entur/layout';
<StatusBadge variant="success">Planlagt</StatusBadge>;

// Etter
import { Tag } from '@entur/layout';
<Tag variant="success">Planlagt</Tag>;
```

Tag støtter nå `size` i stedet for gammel `compact`:

```tsx
// Før (gammel Tag med compact)
<Tag compact>Tekst</Tag>

// Etter
<Tag variant="neutral" size="small">Tekst</Tag>
```

---

## NotificationBadge → Badge

```tsx
// Før
import { NotificationBadge } from '@entur/layout';
<NotificationBadge variant="primary">8</NotificationBadge>;

// Etter
import { Badge } from '@entur/layout';
<Badge type="notification" variant="primary">
  8
</Badge>;
```

---

## BulletBadge → Badge

```tsx
// Før
import { BulletBadge } from '@entur/layout';
<BulletBadge variant="success">Planlagt</BulletBadge>;

// Etter
import { Badge } from '@entur/layout';
<Badge type="bullet" variant="success">
  Planlagt
</Badge>;
```

---

## Deprecated varianter

```tsx
// Før
<Badge variant="danger" ... />
<Badge variant="info" ... />

// Etter
<Badge variant="negative" ... />
<Badge variant="information" ... />
```

---

## invisible → hide

```tsx
// Før
<Badge invisible={isHidden} ... />

// Etter
<Badge hide={isHidden} ... />
```

---

## Nye props

### size (Badge og Tag)

Begge komponenter støtter nå `size="small" | "medium" | "large"` (default: `"medium"`):

```tsx
<Badge type="notification" variant="primary" size="small">3</Badge>
<Tag variant="warning" size="large">Forsinket</Tag>
```

---

## Variantmapping

| Gammel variant         | Ny variant      |
| ---------------------- | --------------- |
| `"primary"`            | `"primary"`     |
| `"neutral"`            | `"neutral"`     |
| `"success"`            | `"success"`     |
| `"warning"`            | `"warning"`     |
| `"negative"`           | `"negative"`    |
| `"information"`        | `"information"` |
| `"danger"` _(fjernet)_ | `"negative"`    |
| `"info"` _(fjernet)_   | `"information"` |
