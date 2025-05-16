import { test, expect } from '@playwright/test';

test.describe('Geo Processor API Flow', () => {
  test('should allow user to input coordinates, submit, and see results', async ({ page, context }) => {
    // Intercept network requests to the API and reroute them for the Docker environment
    // This is crucial because NEXT_PUBLIC_API_URL is http://localhost:3001 for the browser,
    // but inside Docker, the frontend container needs to call the api-nestjs service directly.
    await page.route('**/geo/process', route => {
      const request = route.request();
      const dockerApiUrl = `http://api-nestjs:3001${new URL(request.url()).pathname}`;
      // console.log(`Rerouting API call from ${request.url()} to ${dockerApiUrl}`);
      route.continue({
        url: dockerApiUrl,
        method: request.method(),
        headers: request.headers(),
        postData: request.postData(),
      });
    });

    // 1. Navigate to the home page
    await page.goto('/');
    await expect(page).toHaveTitle(/Geo Processor/);

    // 2. Initial points are already there, let's verify them and then clear them
    const initialPointInputs = await page.getByRole('textbox').all();
    if (initialPointInputs.length >= 2) { // Assuming at least one point with two inputs initially
        await expect(initialPointInputs[0]).toHaveValue('40.7128');
        await expect(initialPointInputs[1]).toHaveValue('-74.006');
    }

    // Remove initial points to start fresh for the test
    // We need to click the delete button for each point. Let's assume there are two initial points.
    // Note: This might need adjustment if the number of initial points changes.
    // It's safer to loop based on the number of delete buttons found.
    const deleteButtons = await page.getByRole('button', { name: 'Remove point' }).all();
    for (let i = deleteButtons.length -1; i>0; i--) { // Remove all but one
        await deleteButtons[i].click();
    }
    // Now clear the inputs of the first point
    const remainingPointInputs = await page.getByRole('textbox').all();
    await remainingPointInputs[0].fill('');
    await remainingPointInputs[1].fill('');


    // 3. Add and fill points
    const addPointButton = page.getByRole('button', { name: 'Add Point' });

    // First point
    let pointInputs = await page.getByRole('textbox').all();
    await pointInputs[0].fill('50.0'); // Lat for first point
    await pointInputs[1].fill('10.0'); // Lng for first point

    // Add a second point
    await addPointButton.click();
    pointInputs = await page.getByRole('textbox').all(); // Re-fetch inputs as new ones are added
    await pointInputs[2].fill('52.5'); // Lat for second point
    await pointInputs[3].fill('13.4'); // Lng for second point

    // 4. Locate and click the submit button
    const processButton = page.getByRole('button', { name: 'Process Coordinates' });
    await processButton.click();

    // 5. Wait for the API call and UI update - focusing on results visibility
    // It's good practice to wait for a specific element that indicates success.
    await expect(page.getByText('Results:')).toBeVisible({ timeout: 10000 }); // Increased timeout for network

    // 6. Verify that the results (centroid/bounds) are displayed correctly
    // These are example values, actual calculation should be verified if possible
    // For a robust test, you might want to calculate expected values based on inputs

    // Verify Centroid (example based on potential output)
    await expect(page.getByText(/Latitude: 51\.25/)).toBeVisible(); // Adjust regex based on actual calculated value
    await expect(page.getByText(/Longitude: 11\.7/)).toBeVisible(); // Adjust regex based on actual calculated value

    // Verify Bounds (example based on potential output)
    await expect(page.getByText(/North: 52\.5/)).toBeVisible();
    await expect(page.getByText(/South: 50\.0/)).toBeVisible();
    await expect(page.getByText(/East: 13\.4/)).toBeVisible();
    await expect(page.getByText(/West: 10\.0/)).toBeVisible();

    // 7. Check if the map container has some content (e.g., Leaflet attribution)
    // This is a basic check; more detailed map checks are complex with Playwright alone.
    const mapContainer = page.locator('#map-container');
    await expect(mapContainer.getByText(/Leaflet/)).toBeVisible();

    // You can also check if there are no error messages
    await expect(page.locator('[role="alert"] dd')).toHaveCount(0); // Assuming ErrorAlert renders an empty dd if no error

  });
}); 