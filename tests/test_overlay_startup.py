import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class OverlayStartupTests(unittest.TestCase):
    def test_dialog_elements_are_hidden_by_default(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")

        for element_id in ("searchOverlay", "personModal", "scrim"):
            match = re.search(
                rf"<[^>]*\bid=[\"']{re.escape(element_id)}[\"'][^>]*>",
                html,
                re.IGNORECASE,
            )
            self.assertIsNotNone(match, f"Missing element with id={element_id}")
            self.assertRegex(match.group(0), r"\bhidden\b")

    def test_hidden_attribute_cannot_be_overridden_by_component_display_rules(self):
        css = (ROOT / "css" / "styles.css").read_text(encoding="utf-8")
        rule_match = re.search(r"\[hidden\]\s*\{([^}]*)\}", css, re.IGNORECASE | re.DOTALL)
        self.assertIsNotNone(rule_match, "Missing [hidden] CSS rule")
        self.assertRegex(rule_match.group(1), r"display\s*:\s*none\s*!important\s*;")

    def test_init_does_not_auto_open_search(self):
        js = (ROOT / "js" / "app.js").read_text(encoding="utf-8")
        self.assertIn("initTheme();", js)
        self.assertIn("renderLanding();", js)
        self.assertIn("wire();", js)
        init_marker = "/* ---------------------------------------------------------------- Init */"
        init_pos = js.rfind(init_marker)
        self.assertNotEqual(init_pos, -1, "Init block marker not found")
        init_block = js[init_pos:]
        self.assertNotIn("openSearch();", init_block)


if __name__ == "__main__":
    unittest.main()
