"""
MathLab GUI Theme & Design System
Professional dark palette, custom ttk styling, and consistent spatial layout rules.
Developed by: Madhur (Team Head)
"""

COLOR_BG = "#0B1020"
COLOR_BG_SECONDARY = "#111827"
COLOR_CARD = "#172033"
COLOR_CARD_HOVER = "#1E293B"
COLOR_ACCENT = "#00D4FF"
COLOR_ACCENT_HOVER = "#38BDF8"
COLOR_SECONDARY_ACCENT = "#8B5CF6"
COLOR_TEXT_PRIMARY = "#F8FAFC"
COLOR_TEXT_SECONDARY = "#94A3B8"
COLOR_BORDER = "#1E293B"
COLOR_SUCCESS = "#10B981"
COLOR_WARNING = "#F59E0B"
COLOR_DANGER = "#EF4444"

FONT_FAMILY = "Segoe UI"
FONT_TITLE = (FONT_FAMILY, 18, "bold")
FONT_HEADING = (FONT_FAMILY, 14, "bold")
FONT_SUBHEADING = (FONT_FAMILY, 11, "bold")
FONT_BODY = (FONT_FAMILY, 10)
FONT_BODY_BOLD = (FONT_FAMILY, 10, "bold")
FONT_MONO = ("Consolas", 10)
FONT_MONO_LARGE = ("Consolas", 14, "bold")
FONT_STAT = (FONT_FAMILY, 22, "bold")


def apply_theme(root, ttk_style):
    """Apply unified dark styling across Tkinter and ttk widgets."""
    root.configure(bg=COLOR_BG)
    ttk_style.theme_use("clam")

    # Global background & text
    ttk_style.configure(".", background=COLOR_BG, foreground=COLOR_TEXT_PRIMARY, font=FONT_BODY)
    ttk_style.configure("TFrame", background=COLOR_BG)
    ttk_style.configure("Card.TFrame", background=COLOR_CARD, relief="flat", borderwidth=1)
    ttk_style.configure("Secondary.TFrame", background=COLOR_BG_SECONDARY)

    # Labels
    ttk_style.configure("TLabel", background=COLOR_BG, foreground=COLOR_TEXT_PRIMARY)
    ttk_style.configure("Card.TLabel", background=COLOR_CARD, foreground=COLOR_TEXT_PRIMARY)
    ttk_style.configure("CardMuted.TLabel", background=COLOR_CARD, foreground=COLOR_TEXT_SECONDARY, font=FONT_BODY)
    ttk_style.configure("Header.TLabel", background=COLOR_BG, foreground=COLOR_TEXT_PRIMARY, font=FONT_TITLE)
    ttk_style.configure("Subheader.TLabel", background=COLOR_BG, foreground=COLOR_TEXT_SECONDARY, font=FONT_SUBHEADING)
    ttk_style.configure("Accent.TLabel", background=COLOR_BG, foreground=COLOR_ACCENT, font=FONT_HEADING)

    # Buttons
    ttk_style.configure(
        "TButton",
        background=COLOR_CARD,
        foreground=COLOR_TEXT_PRIMARY,
        borderwidth=0,
        focuscolor="none",
        padding=(12, 8),
        font=FONT_BODY_BOLD,
    )
    ttk_style.map("TButton", background=[("active", COLOR_CARD_HOVER), ("pressed", COLOR_BORDER)])

    ttk_style.configure(
        "Accent.TButton",
        background=COLOR_ACCENT,
        foreground="#000000",
        borderwidth=0,
        focuscolor="none",
        padding=(14, 8),
        font=FONT_BODY_BOLD,
    )
    ttk_style.map("Accent.TButton", background=[("active", COLOR_ACCENT_HOVER), ("pressed", "#0284C7")])

    ttk_style.configure(
        "Secondary.TButton",
        background=COLOR_SECONDARY_ACCENT,
        foreground="#FFFFFF",
        borderwidth=0,
        focuscolor="none",
        padding=(12, 8),
        font=FONT_BODY_BOLD,
    )
    ttk_style.map("Secondary.TButton", background=[("active", "#7C3AED")])

    # Sidebar Nav Buttons
    ttk_style.configure(
        "Nav.TButton",
        background=COLOR_BG_SECONDARY,
        foreground=COLOR_TEXT_SECONDARY,
        anchor="w",
        padding=(16, 10),
        font=FONT_BODY_BOLD,
        borderwidth=0,
    )
    ttk_style.map(
        "Nav.TButton",
        background=[("active", COLOR_CARD), ("selected", COLOR_CARD)],
        foreground=[("active", COLOR_ACCENT), ("selected", COLOR_ACCENT)],
    )

    # Entry fields
    ttk_style.configure(
        "TEntry",
        fieldbackground=COLOR_CARD,
        foreground=COLOR_TEXT_PRIMARY,
        insertcolor=COLOR_TEXT_PRIMARY,
        borderwidth=1,
        relief="flat",
        padding=6,
    )

    # Treeview (tables)
    ttk_style.configure(
        "Treeview",
        background=COLOR_CARD,
        foreground=COLOR_TEXT_PRIMARY,
        fieldbackground=COLOR_CARD,
        borderwidth=0,
        font=FONT_BODY,
        rowheight=26,
    )
    ttk_style.configure(
        "Treeview.Heading",
        background=COLOR_BG_SECONDARY,
        foreground=COLOR_ACCENT,
        font=FONT_SUBHEADING,
        relief="flat",
        padding=6,
    )
    ttk_style.map("Treeview", background=[("selected", COLOR_SECONDARY_ACCENT)])
