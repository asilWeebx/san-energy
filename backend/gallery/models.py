from django.db import models


class SiteImage(models.Model):
    """Sayt rasmlari — admin paneldan boshqariladi (galereya/slayder, Biz
    haqimizda, hero fon). Online do'kon (DukOnline) bilan ALOQASI YO'Q."""

    SECTION_CHOICES = [
        ("gallery", "Galereya / slayder"),
        ("about", "Biz haqimizda"),
        ("hero", "Hero (yuqori fon)"),
    ]

    section = models.CharField(max_length=20, choices=SECTION_CHOICES, default="gallery", db_index=True)
    image = models.ImageField(upload_to="site/%Y/%m/")
    title = models.CharField(max_length=200, blank=True, default="")
    order = models.IntegerField(default=0, help_text="Kichik son — oldinroq")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["section", "order", "-created_at"]

    def __str__(self):
        return f"{self.get_section_display()} · {self.title or self.image.name}"
