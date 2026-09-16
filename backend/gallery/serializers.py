from rest_framework import serializers

from .models import SiteImage


class SiteImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = SiteImage
        fields = ["id", "section", "url", "title", "order", "is_active", "created_at"]

    def get_url(self, obj):
        request = self.context.get("request")
        if not obj.image:
            return None
        url = obj.image.url
        return request.build_absolute_uri(url) if request else url
