import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class OverlayStartupTests(unittest.TestCase):
    def test_dialog_elements_are_hidden_in_markup(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")

        for element_id in ("searchOverlay", "personModal", "scrim"):
            match = re.search(
                rf"<[^>]*\bid=[\"']{re.escape(element_id)}[\"'][^>]*>",
                html,
                re.IGNORECASE,
            )
            self.assertIsNotNone(match, f"Missing element with id={element_id}")
            self.assertRegex(match.group(0), r"\bhidden\b")

    def test_hidden_attribute_enforced_by_css_rule(self):
        css = (ROOT / "css" / "styles.css").read_text(encoding="utf-8")
        rule_match = re.search(r"\[hidden\]\s*\{([^}]*)\}", css, re.IGNORECASE | re.DOTALL)
        self.assertIsNotNone(rule_match, "Missing [hidden] CSS rule")
        self.assertRegex(rule_match.group(1), r"display\s*:\s*none\s*!important\s*;?")

    def test_init_does_not_auto_open_search(self):
        js = (ROOT / "js" / "app.js").read_text(encoding="utf-8")
        self.assertRegex(js, r"initTheme\(\);\s*renderLanding\(\);\s*wire\(\);\s*\}\)\(\);")


if __name__ == "__main__":
    unittest.main()
