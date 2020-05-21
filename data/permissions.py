from rest_framework import permissions


class IsOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):

        if request.user.is_staff:
            return True

        if hasattr(obj, 'assignee'):
            return obj.assignee == request.user

        return False


class IsOwnerOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.user.is_staff:
            return True

        if hasattr(obj, 'created_by'):
            return obj.created_by == request.user

        if hasattr(obj, 'added_by'):
            return obj.added_by == request.user

        return False


class IsCreationOrAuthenticated(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method == 'POST':
            return True

        return request.user.is_authenticated or request.user.is_staff


class IsAdminOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.is_staff
