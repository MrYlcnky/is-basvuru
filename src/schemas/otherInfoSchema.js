import { z } from "zod";

export const createOtherInfoSchema = (t) => {
  const reqMsg = (key) => ({
    invalid_type_error: t(`otherInfo.errors.${key}`),
    required_error: t(`otherInfo.errors.${key}`),
  });

  return z
    .object({
      kktcGecerliBelge: z.string(reqMsg("kktcDoc")).min(1, t("otherInfo.errors.kktcDoc")),
      davaDurumu: z.string(reqMsg("lawsuit")).min(1, t("otherInfo.errors.lawsuit")),
      davaNedeni: z
        .string()
        .trim()
        .max(250, t("otherInfo.errors.lawsuitReason"))
        .optional(),
      sigara: z.string(reqMsg("smoke")).min(1, t("otherInfo.errors.smoke")),
      kaliciRahatsizlik: z
        .string(reqMsg("permanentDisease"))
        .min(1, t("otherInfo.errors.permanentDisease")),
      rahatsizlikAciklama: z
        .string()
        .trim()
        .max(250, t("otherInfo.errors.diseaseDesc"))
        .optional(),
      ehliyet: z.string(reqMsg("license")).min(1, t("otherInfo.errors.license")),
      ehliyetTurleri: z.array(z.string()).optional().default([]),
      askerlik: z.string(reqMsg("military")).min(1, t("otherInfo.errors.military")),
      boy: z.coerce
        .number({ invalid_type_error: t("otherInfo.errors.heightNum") })
        .int()
        .min(50)
        .max(250),
      kilo: z.coerce
        .number({ invalid_type_error: t("otherInfo.errors.weightNum") })
        .int()
        .min(20)
        .max(300),
    })
    .superRefine((data, ctx) => {
      // "Evet", "Yes", "Var", "Have" kontrolü
      const isPositive = (val) =>
        ["evet", "yes", "var", "have"].includes(String(val || "").toLowerCase());

      // Dava varsa nedeni zorunlu
      if (isPositive(data.davaDurumu) && (!data.davaNedeni || data.davaNedeni.trim().length < 3)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["davaNedeni"],
          message: t("otherInfo.errors.lawsuitReason"),
        });
      }

      // Rahatsızlık varsa açıklama zorunlu
      if (
        isPositive(data.kaliciRahatsizlik) &&
        (!data.rahatsizlikAciklama || data.rahatsizlikAciklama.trim().length < 5)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["rahatsizlikAciklama"],
          message: t("otherInfo.errors.diseaseDesc"),
        });
      }

      // Ehliyet varsa türü zorunlu
      if (isPositive(data.ehliyet) && (!data.ehliyetTurleri || data.ehliyetTurleri.length < 1)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ehliyetTurleri"],
          message: t("otherInfo.errors.licenseTypes"),
        });
      }
    });
};