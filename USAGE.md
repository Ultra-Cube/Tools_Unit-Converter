# Usage Guide

This guide provides more detailed examples and tips for using and extending the Multi-Unit Converter.

## Quick Start

1. Open `index.html` in any modern browser (no build step required).
2. Pick a category from the dropdown.
3. Choose From and To units.
4. Enter a numeric value.
5. Click Convert to see the result.

## Supported Categories & Units

See `script.js` for the exact list. Categories: length, weight, temperature, area, volume, data.

## Sample Conversions

| Input | From | To | Result |
|-------|------|----|--------|
| 10 | Meter | Foot | 32.808399 |
| 128 | Gigabyte | Megabyte | 131072 |
| 72 | Fahrenheit | Celsius | 22.22 |
| 2 | Acre | Square Meter | 8093.72 |

## Precision

Numeric results are rounded:

- Length, weight, area, volume, data: 6 decimal places
- Temperature: 2 decimal places

## Extending

1. Add a unit object to the correct category in `units`.
2. Update the relevant base conversion map (e.g., `toMeter`, `toKg`).
3. If adding a new category, add:
   - An entry in `units`
   - A new convert function
   - A new case in `convert()`

## Troubleshooting

- Blank result: Ensure you entered a number.
- Unexpected temperature: Remember Fahrenheit/Celsius rounding.
- Large numbers in data conversions are base-2 (1 KB = 1024 Bytes).

## Ideas To Improve

- Auto-convert on input change
- Swap units button
- Copy result button
- Dark mode toggle
- Persist last category in localStorage

Pull requests welcome.
