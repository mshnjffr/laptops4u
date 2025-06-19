import { Component } from '@angular/core';

@Component({
  selector: 'app-test-generation',
  imports: [],
  templateUrl: './test-generation.component.html',
  styleUrl: './test-generation.component.scss'
})
export class TestGenerationComponent {
  
  copyToClipboard(promptType: string) {
    const prompts = {
      'basic-endpoints': `Generate Jest and Supertest tests for the following Express.js endpoints:
1. GET /api/health - should return status 200 with status: 'OK'
2. GET /api/laptops - should return status 200 with array of laptops
3. GET /api/laptops/:id - should return 200 for valid ID, 404 for invalid ID

Use proper test structure with describe blocks and meaningful test descriptions.`,

      'post-validation': `Generate comprehensive Jest and Supertest tests for POST /api/orders endpoint with this validation logic:
- Requires 'items' array in request body
- Each item needs 'laptopId' and positive 'quantity'
- Validates laptop exists and is in stock
- Returns 201 on success, 400 for validation errors, 404 if laptop not found

Include tests for: valid payload, missing items, invalid quantity, non-existent laptop ID, out of stock scenarios.`,


    };

    const prompt = prompts[promptType as keyof typeof prompts];
    if (prompt) {
      navigator.clipboard.writeText(prompt).then(() => {
        // Could add a toast notification here
        console.log('Prompt copied to clipboard');
      });
    }
  }
}
