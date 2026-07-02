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
        self.assertRegex(
            css,
            r"\[hidden\]\s*\{[^}]*display\s*:\s*none\s*!important\s*;",
        )

    def test_init_does_not_auto_open_search(self):
        js = (ROOT / "js" / "app.js").read_text(encoding="utf-8")
        self.assertIn("initTheme();", js)
        self.assertIn("renderLanding();", js)
        self.assertIn("wire();", js)
        init_block = js[js.rfind("/* ---------------------------------------------------------------- Init */") :]
        self.assertNotIn("openSearch();", init_block)


if __name__ == "__main__":
    unittest.main()
