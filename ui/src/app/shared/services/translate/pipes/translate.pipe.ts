import { Pipe, PipeTransform, inject } from "@angular/core";
import { TranslateService } from "../services/translate.service";

@Pipe({ name: "translate", pure: false, standalone: true })
export class TranslatePipe implements PipeTransform {
  private translationService = inject(TranslateService);

  transform(
    input: string | null | undefined,
    values?: Record<string, any>
  ): string {
    if (!input) {
      return "";
    }

    return this.translationService.translate(input, values);
  }
}
