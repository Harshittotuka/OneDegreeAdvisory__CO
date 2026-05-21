from playwright.sync_api import sync_playwright
import os

OUT = r"d:\Infolith Projects\ODA_Codex\verify_out"
os.makedirs(OUT, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    page = ctx.new_page()

    errors = []
    page.on("pageerror", lambda e: errors.append(f"[pageerror] {e}"))

    page.goto("http://localhost:8765/", wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(900)

    form = page.locator("[data-hero-consult]").first
    form.scroll_into_view_if_needed()
    page.wait_for_timeout(300)

    # Crop to form area for clarity
    form_box = form.bounding_box()
    print(f"Form box: {form_box}")
    page.screenshot(path=os.path.join(OUT, "01_form_initial.png"),
                    clip={"x": max(0, form_box["x"]-20), "y": max(0, form_box["y"]-20),
                          "width": min(1440, form_box["width"]+40), "height": min(900, form_box["height"]+40)})

    # Click ISD selector, capture wide view with dropdown
    page.locator(".hc-phone-country .cbx-field").first.click()
    page.wait_for_timeout(450)
    panel = page.locator(".cbx-panel.is-open")
    print(f"ISD panel after click - count: {panel.count()}")
    if panel.count():
        box = panel.first.bounding_box()
        print(f"ISD panel bounding: {box}, visible: {panel.first.is_visible()}")
    page.screenshot(path=os.path.join(OUT, "02_isd_open_full.png"), full_page=False)

    # Close and click State
    page.keyboard.press("Escape")
    page.wait_for_timeout(300)

    state_label = page.locator("label.hc-select:has([data-state-select])").first
    state_label.locator(".cbx-field").first.click()
    page.wait_for_timeout(450)
    panel2 = page.locator(".cbx-panel.is-open")
    print(f"State panel after click - count: {panel2.count()}")
    if panel2.count():
        box = panel2.first.bounding_box()
        print(f"State panel bounding: {box}, visible: {panel2.first.is_visible()}")
    page.screenshot(path=os.path.join(OUT, "03_state_open_full.png"), full_page=False)

    # Select a state and check that city becomes enabled and floating labels behave
    page.locator(".cbx-panel.is-open .cbx-option").first.click()
    page.wait_for_timeout(450)
    page.screenshot(path=os.path.join(OUT, "04_after_state_select.png"),
                    clip={"x": max(0, form_box["x"]-20), "y": max(0, form_box["y"]-20),
                          "width": min(1440, form_box["width"]+40), "height": min(900, form_box["height"]+40)})

    # Open city dropdown
    city_label = page.locator("label.hc-select:has([data-city-select])").first
    city_label.locator(".cbx-field").first.click()
    page.wait_for_timeout(450)
    panel3 = page.locator(".cbx-panel.is-open")
    print(f"City panel - count: {panel3.count()}, visible: {panel3.first.is_visible() if panel3.count() else None}")
    if panel3.count():
        print(f"City panel bounding: {panel3.first.bounding_box()}")
    page.screenshot(path=os.path.join(OUT, "05_city_open_full.png"), full_page=False)

    print("--- ERRORS ---")
    for e in errors:
        print(e)
    if not errors:
        print("(no JS errors)")

    browser.close()
print("DONE")
