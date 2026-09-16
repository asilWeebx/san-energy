from django.contrib import admin
from django.utils.html import format_html

from .models import SiteImage


@admin.register(SiteImage)
class SiteImageAdmin(admin.ModelAdmin):
    list_display = ("preview", "section", "title", "order", "is_active", "created_at")
    list_filter = ("section", "is_active")
    list_editable = ("order", "is_active")

    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:44px;border-radius:6px" />', obj.image.url)
        return "—"
