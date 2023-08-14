def cookie_session(request):
    request.session.set_test_cookie()
    return HttpResponse("<h1>TechVidvan</h1>")


def cookie_delete(request):
    if request.session.test_cookie_worked():
        request.session.delete_test_cookie()
        response = HttpResponse("TechVidvan<br> This is your newly created cookie")
    else:
        response = HttpResponse("TechVidvan <br> Sorry!! your browser does not accept cookies")
    return response