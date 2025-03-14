# Pricing Schema (`pricing` related collections) - Product-Based

## Collections:

*   `products`
*   `pricingPlans`
*   `pricingPlanItems` (subcollection of `pricingPlans`)
``````typescript
    interface Product {
        productId: string;
        productName: string;
        description: string
    }

    interface PricePlan {
        planId: string;
        productId: string;
        planName: string;
        price: number;
        currency: string;
        interval: string; // "month", "year", "one-time"
        active: boolean;
        features: string[]
    }

    //Subcollection of Price Plan
    interface PricePlanItem {
        itemId: string;
        description: string;
        included: boolean; // Or could be a quantity.
    }

```

*   **`products`:**  Stores information about the different products or services you offer (e.g., "Website Design," "SEO Services," "Hosting").
*   **`pricingPlans`:** Stores different pricing plans (e.g., "Basic," "Pro," "Enterprise").  Each plan is linked to a `product`.
*   **`pricingPlanItems`:** (Subcollection of `pricingPlans`) Stores the individual line items included in each pricing plan.

*   **Pros:**  Highly flexible; can handle complex pricing structures, add-ons, and variations.
*   **Cons:**  Most complex to implement.

**Recommendation:**

*   If your pricing is very simple and static, **Option 1** might be sufficient.
*   For most cases, **Option 2 (Structured Pricing Tiers)** provides a good balance of structure and flexibility.
*   If you have very complex or product-based pricing, consider **Option 3**.

**For the MVP, I recommend starting with Option 2.** You can always migrate to a more complex structure later if needed.

I'll provide the example JSON for Option 2:

**Example JSON (Option 2 - `pricing` Collection):**

```json
[
  {
    "tierId": "basic",
    "tierName": "Basic",
    "price": 99,
    "currency": "AUD",
    "features": [
      "1 website",
      "10GB storage",
      "Basic support"
    ],
    "description": "Ideal for small businesses.",
    "callToAction": "Get Started",
    "callToActionUrl": "/signup/basic",
    "order": 1,
    "createdAt": "2024-03-13T11:00:00Z",
    "updatedAt": "2024-03-13T11:00:00Z"
  },
  {
    "tierId": "pro",
    "tierName": "Pro",
    "price": 299,
    "currency": "AUD",
    "features": [
      "5 websites",
      "50GB storage",
      "Priority support",
      "SEO tools"
    ],
    "description": "For growing businesses.",
    "callToAction": "Get Started",
    "callToActionUrl": "/signup/pro",
     "order": 2,
    "createdAt": "2024-03-13T11:00:00Z",
    "updatedAt": "2024-03-13T11:00:00Z"
  },
  {
    "tierId": "enterprise",
    "tierName": "Enterprise",
    "price": 999,
    "currency": "AUD",
    "features": [
      "Unlimited websites",
      "Unlimited storage",
      "Dedicated account manager",
      "Advanced features"
    ],
    "description": "For large organizations.",
    "callToAction": "Contact Us",
    "callToActionUrl": "/contact",
     "order": 3,
    "createdAt": "2024-03-13T11:00:00Z",
    "updatedAt": "2024-03-13T11:00:00Z"
  }
]
```