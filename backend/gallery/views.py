from django.conf import settings
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from .models import SiteImage
from .serializers import SiteImageSerializer


def _is_admin(request):
    key = request.headers.get("X-Admin-Key", "")
    return bool(key) and key == settings.ADMIN_KEY


# ── Ochiq (landing o'qiydi) ──────────────────────────────────────
@api_view(["GET"])
def images_list(request):
    section = request.GET.get("section")
    qs = SiteImage.objects.filter(is_active=True)
    if section:
        qs = qs.filter(section=section)
    return Response(SiteImageSerializer(qs, many=True, context={"request": request}).data)


# ── Admin login (parol = ADMIN_KEY) ──────────────────────────────
@api_view(["POST"])
def admin_login(request):
    pw = (request.data.get("password") or "").strip()
    if pw and pw == settings.ADMIN_KEY:
        return Response({"ok": True, "token": settings.ADMIN_KEY})
    return Response({"ok": False, "error": "Parol noto'g'ri"}, status=401)


# ── Admin: ro'yxat + yuklash ─────────────────────────────────────
@api_view(["GET", "POST"])
@parser_classes([MultiPartParser, FormParser])
def admin_images(request):
    if not _is_admin(request):
        return Response({"error": "Ruxsat yo'q"}, status=401)
    if request.method == "GET":
        section = request.GET.get("section")
        qs = SiteImage.objects.all()
        if section:
            qs = qs.filter(section=section)
        return Response(SiteImageSerializer(qs, many=True, context={"request": request}).data)
    # POST — rasm yuklash
    f = request.FILES.get("image")
    if not f:
        return Response({"error": "Rasm yuborilmadi"}, status=400)
    obj = SiteImage.objects.create(
        section=request.data.get("section", "gallery") or "gallery",
        image=f,
        title=request.data.get("title", "") or "",
        order=int(request.data.get("order") or 0),
    )
    return Response(SiteImageSerializer(obj, context={"request": request}).data, status=201)


# ── Admin: tahrirlash / o'chirish ────────────────────────────────
@api_view(["PATCH", "DELETE"])
def admin_image_detail(request, pk):
    if not _is_admin(request):
        return Response({"error": "Ruxsat yo'q"}, status=401)
    try:
        obj = SiteImage.objects.get(pk=pk)
    except SiteImage.DoesNotExist:
        return Response({"error": "Topilmadi"}, status=404)
    if request.method == "DELETE":
        obj.image.delete(save=False)
        obj.delete()
        return Response(status=204)
    for field in ("title", "section"):
        if field in request.data:
            setattr(obj, field, request.data[field])
    if "order" in request.data:
        obj.order = int(request.data["order"] or 0)
    if "is_active" in request.data:
        val = request.data["is_active"]
        obj.is_active = val in (True, "true", "1", 1)
    obj.save()
    return Response(SiteImageSerializer(obj, context={"request": request}).data)
